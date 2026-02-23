import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot } from '@react-native-firebase/firestore';
import * as v from 'valibot';
import { dataLogger } from '../logger';
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

    dataLogger.logRequest('useCrew subscription', { starshipId });
          const unsubscribe = onSnapshot(
            collection(getFirestore(), `api/v1/starships/${starshipId}/crew`),
            (snapshot) => {
        dataLogger.logResponse(`useCrew snapshot (${starshipId})`, { count: snapshot.size });
          try {
            const crewData = snapshot.docs.map((doc: any) => {
              const data = doc.data();
              const validated = v.parse(CrewSchema, data);
              return { ...validated, id: doc.id };
            });
            setCrew(crewData);
            setError(null);
          } catch (err: any) {
            dataLogger.logError('useCrew validation', err);
            if (v.isValiError(err)) {
              setError(`Validation Error: ${err.issues.map((i: any) => i.message).join(', ')}`);
            } else {
              setError(err.message || 'An unknown error occurred during validation');
            }
          }
          setLoading(false);
        },
        (err) => {
          dataLogger.logError('useCrew firestore', err);
          setError(err.message);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [starshipId]);

  return { crew, loading, error };
}
