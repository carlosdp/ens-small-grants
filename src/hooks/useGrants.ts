import { useState, useEffect } from 'react';

import { client } from '../supabase';

export type Grant = {
  id: number;
  title: string;
  description: string;
  full_text: string;
};

export function useGrants(roundId: number) {
  const [grants, setGrants] = useState<Grant[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await client.from('grants').select().eq('round_id', roundId);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setGrants(data);
      setLoading(false);
    })();
  }, [roundId]);

  return { grants, loading };
}
