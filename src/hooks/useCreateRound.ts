import { useCallback } from 'react';

import { functionRequest } from '../supabase';

export function useCreateRound() {
  const createRound = useCallback((name: string, description?: string) => {
    return functionRequest('create-round', {
      name,
      description,
    });
  }, []);

  return { createRound };
}
