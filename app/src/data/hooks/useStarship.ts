import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import * as v from 'valibot';
import { dataLogger } from '../logger';
import { StarshipSchema, type Starship } from '../models';

/**
 * Hook to subscribe to a specific starship's data.
 * @param starshipId The ID of the starship to subscribe to.
 */
export function useStarship(starshipId: string | null) {
  const [starship, setStarship] = useState<Starship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!starshipId) {
      setStarship(null);
      setLoading(false);
      return;
    }

    dataLogger.logRequest('useStarship subscription', { starshipId });
    const unsubscribe = firestore()
      .doc(`api/v1/starships/${starshipId}`)
      .onSnapshot(
        (doc) => {
          // @ts-ignore - DocumentSnapshot.exists is a property in some versions and a function in others
          const exists = typeof doc.exists === 'function' ? doc.exists() : doc.exists;
          dataLogger.logResponse(`useStarship snapshot (${starshipId})`, { exists });
          if (exists) {
            try {
              const data = doc.data();
              // Validate with Valibot
              const validated = v.parse(StarshipSchema, { ...data, starshipId: doc.id });
              setStarship(validated);
              setError(null);
            } catch (err: any) {
              dataLogger.logError('useStarship validation', err);
              if (v.isValiError(err)) {
                setError(`Validation Error: ${err.issues.map((i: any) => i.message).join(', ')}`);
              } else {
                setError(err.message || 'An unknown error occurred during validation');
              }
              setStarship(null);
            }
          } else {
            setStarship(null);
            setError('Starship not found');
          }
          setLoading(false);
        },
        (err) => {
          dataLogger.logError('useStarship firestore', err);
          setError(err.message);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [starshipId]);

  return { starship, loading, error };
}
