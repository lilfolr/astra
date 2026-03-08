import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
} from '@react-native-firebase/firestore';
import { type ShopItem } from '../models';

/**
 * Hook to subscribe to shop items for a specific starship.
 */
export const useShopItems = (starshipId: string | null) => {
  const [items, setItems] = useState<(ShopItem & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!starshipId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(getFirestore(), `api/v1/starships/${starshipId}/shopItems`),
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const shopItems = snapshot.docs.map((doc: any) => ({
          ...(doc.data() as ShopItem),
          id: doc.id,
        }));
        setItems(shopItems);
        setLoading(false);
      },
      err => {
        console.error('Error fetching shop items:', err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [starshipId]);

  return { items, loading, error };
};
