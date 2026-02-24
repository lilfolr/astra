import { useState, useEffect } from 'react';
import {
  getFirestore,
  doc,
  onSnapshot,
} from '@react-native-firebase/firestore';
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
      dataLogger.log(
        'useStarship: No starshipId provided, skipping subscription',
      );
      return;
    }

    dataLogger.logRequest('useStarship subscription', { starshipId });
    const unsubscribe = onSnapshot(
      doc(getFirestore(), `api/v1/starships/${starshipId}`),
      snapshot => {
        // @ts-ignore - DocumentSnapshot.exists is a property in some versions and a function in others
        const exists =
          typeof snapshot.exists === 'function'
            ? snapshot.exists()
            : snapshot.exists;
        dataLogger.logResponse(`useStarship snapshot (${starshipId})`, {
          exists,
        });
        if (exists) {
          try {
            const data = snapshot.data();
            // Validate with Valibot
            const validated = v.parse(StarshipSchema, {
              ...data,
              starshipId: snapshot.id,
            });
            setStarship(validated);
            setError(null);
          } catch (err: any) {
            dataLogger.logError('useStarship validation', err);
            if (v.isValiError(err)) {
              setError(
                `Validation Error: ${err.issues
                  .map((i: any) => i.message)
                  .join(', ')}`,
              );
            } else {
              setError(
                err.message || 'An unknown error occurred during validation',
              );
            }
            setStarship(null);
          }
        } else {
          setStarship(null);
          setError('Starship not found');
        }
        setLoading(false);
      },
      err => {
        dataLogger.logError('useStarship firestore', err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [starshipId]);

  return { starship, loading, error };
}
