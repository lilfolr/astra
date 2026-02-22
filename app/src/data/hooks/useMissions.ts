import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import * as v from 'valibot';
import { MissionSchema, type Mission } from '../models';

/**
 * Hook to subscribe to missions of a specific starship.
 * @param starshipId The ID of the starship.
 */
export function useMissions(starshipId: string | null) {
  const [missions, setMissions] = useState<(Mission & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!starshipId) {
      setMissions([]);
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection(`api/v1/starships/${starshipId}/missions`)
      .onSnapshot(
        (snapshot) => {
          try {
            const missionsData = snapshot.docs.map((doc) => {
              const data = doc.data();
              const validated = v.parse(MissionSchema, data);
              return { ...validated, id: doc.id };
            });
            setMissions(missionsData);
            setError(null);
          } catch (err: any) {
            if (v.isValiError(err)) {
              setError(`Validation Error: ${err.issues.map((i: any) => i.message).join(', ')}`);
            } else {
              setError(err.message || 'An unknown error occurred during validation');
            }
          }
          setLoading(false);
        },
        (err) => {
          console.error('Firestore error in useMissions:', err);
          setError(err.message);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [starshipId]);

  return { missions, loading, error };
}
