import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import * as v from 'valibot';
import { CrewSchema, type Crew } from '../models';

/**
 * Hook to subscribe to crew members of a specific starship.
 * @param starshipId The ID of the starship.
 */
export function useCrew(starshipId: string | null) {
  const [crew, setCrew] = useState<(Crew & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!starshipId) {
      setCrew([]);
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection(`api/v1/starships/${starshipId}/crew`)
      .onSnapshot(
        (snapshot) => {
          try {
            const crewData = snapshot.docs.map((doc) => {
              const data = doc.data();
              const validated = v.parse(CrewSchema, data);
              return { ...validated, id: doc.id };
            });
            setCrew(crewData);
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
          console.error('Firestore error in useCrew:', err);
          setError(err.message);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [starshipId]);

  return { crew, loading, error };
}
