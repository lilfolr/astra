import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import * as v from 'valibot';
import { ModuleSchema, type Module } from '../models';

/**
 * Hook to subscribe to modules of a specific starship.
 * @param starshipId The ID of the starship.
 */
export function useModules(starshipId: string | null) {
  const [modules, setModules] = useState<(Module & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!starshipId) {
      setModules([]);
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection(`api/v1/starships/${starshipId}/modules`)
      .onSnapshot(
        (snapshot) => {
          try {
            const modulesData = snapshot.docs.map((doc) => {
              const data = doc.data();
              const validated = v.parse(ModuleSchema, data);
              return { ...validated, id: doc.id };
            });
            setModules(modulesData);
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
          console.error('Firestore error in useModules:', err);
          setError(err.message);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [starshipId]);

  return { modules, loading, error };
}
