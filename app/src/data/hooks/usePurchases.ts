import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from '@react-native-firebase/firestore';
import { type Purchase } from '../models';

/**
 * Hook to subscribe to purchases for a specific starship.
 */
export const usePurchases = (starshipId: string | null) => {
  const [purchases, setPurchases] = useState<(Purchase & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!starshipId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(getFirestore(), `api/v1/starships/${starshipId}/purchases`),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const purchaseData = snapshot.docs.map((doc: any) => ({
          ...(doc.data() as Purchase),
          id: doc.id,
        }));
        setPurchases(purchaseData);
        setLoading(false);
      },
      err => {
        console.error('Error fetching purchases:', err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [starshipId]);

  return { purchases, loading, error };
};
