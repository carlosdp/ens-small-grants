import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL ?? 'http://localhost:54321';
const SUPABASE_ANON_KEY =
  import.meta.env.SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs';

export const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const functionRequest = (name: string, data?: any) => {
  return fetch(`${SUPABASE_URL}/functions/v1/rpc`, {
    method: 'POST',
    body: JSON.stringify({ method: name, ...data }),
    headers: {
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'content-type': 'application/json',
    },
  });
};
