import { useEffect, useState } from 'react';

import { client } from '../supabase';

export type Round = {
  id: string;
  name: string;
  description?: string | null;
};

export function useRounds() {
  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await client.from('rounds').select();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setRounds(data);
      setLoading(false);
    })();
  }, []);

  return { rounds, loading };
}
