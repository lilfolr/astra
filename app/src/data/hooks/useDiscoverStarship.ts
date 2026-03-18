import { useState, useEffect } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  query,
  collectionGroup,
  where,
  limit,
  getDocs,
  getDoc,
} from '@react-native-firebase/firestore';
import * as v from 'valibot';
import { starshipService } from '../services/starshipService';
import { StarshipSchema } from '../models';

/**
 * Hook to discover the starship ID for the current authenticated user.
 * It follows a hierarchy: mapping lookup, captain lookup, then crew lookup.
 */
export function useDiscoverStarship() {
  const [starshipId, setStarshipId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const discover = async () => {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        try {
          if (isMounted) setLoading(true);

          // 1. Try to get starship ID from the new mapping collection (fastest)
          let sid = await starshipService.getStarshipIdForUser(currentUser.uid);

          if (!sid) {
            // 2. Fallback to searching by captain ID
            let starship = await starshipService.getStarshipByCaptainId(
              currentUser.uid,
            );

            // 3. If not a captain, try crew lookup
            let crewMemberId: string | undefined;
            if (!starship) {
              // We need the crew document ID to verify the mapping creation
              const q = query(
                collectionGroup(getFirestore(), 'crew'),
                where('uid', '==', currentUser.uid),
                limit(1),
              );
              const snapshot = await getDocs(q);
              if (!snapshot.empty) {
                const crewDoc = snapshot.docs[0];
                crewMemberId = crewDoc.id;
                const starshipDocRef = crewDoc.ref.parent.parent;
                if (starshipDocRef) {
                  const starshipSnapshot = await getDoc(starshipDocRef);
                  if (starshipSnapshot.exists()) {
                    starship = v.parse(StarshipSchema, {
                      ...(starshipSnapshot.data() as object),
                      starshipId: starshipSnapshot.id,
                    });
                  }
                }
              }
            }

            sid = starship?.starshipId || currentUser.uid;

            // 4. Establish the mapping for future fast lookups
            try {
              await starshipService.linkUserToStarship(
                currentUser.uid,
                sid,
                crewMemberId,
              );
            } catch (linkErr) {
              console.error('Error linking user to starship:', linkErr);
            }
          }

          if (sid) {
            // Ensure captain/user has a crew record
            await starshipService.ensureCaptainCrewRecord(
              sid,
              currentUser.uid,
              currentUser.email?.split('@')[0] || 'Captain',
            );
          }

          if (isMounted) {
            setStarshipId(sid);
            setError(null);
          }
        } catch (err: any) {
          console.error('Error discovering starship:', err);
          if (isMounted) {
            setError(err.message || 'Error discovering starship');
            // Fallback to UID as starshipId in case of error
            setStarshipId(currentUser.uid);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setLoading(false);
          setError('No authenticated user found');
        }
      }
    };

    discover();

    return () => {
      isMounted = false;
    };
  }, []);

  return { starshipId, loading, error };
}
