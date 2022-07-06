import Arweave from 'arweave';
import { useCallback, useState } from 'react';
import { useSigner, useAccount } from 'wagmi';

import { client } from '../supabase';

export type CreateSnapshotArgs = {
  roundId: number;
};

export function useCreateSnapshot() {
  const { data: signer } = useSigner();
  const { data: account } = useAccount();
  const [loading, setLoading] = useState(false);

  const createSnapshot = useCallback(
    async (args: CreateSnapshotArgs) => {
      if (signer && account) {
        try {
          setLoading(true);

          const arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
          });

          const { data: grants, error } = await client
            .from('grants')
            .select()
            .eq('round_id', args.roundId)
            .eq('deleted', false);

          if (error) {
            throw new Error('failed to fetch grants');
          }

          const grantsData = grants.map(grant => ({
            proposer: grant.proposer,
            title: grant.title,
            description: grant.description,
            fullText: grant.full_text,
          }));

          const transaction = await arweave.createTransaction({ data: JSON.stringify(grantsData) });
          transaction.addTag('Content-Type', 'application/json');
          transaction.addTag('App-Name', 'ENS-Small-Grants-v1');

          await arweave.transactions.sign(transaction);

          const uploader = await arweave.transactions.getUploader(transaction);

          while (!uploader.isComplete) {
            await uploader.uploadChunk();
          }
        } finally {
          setLoading(false);
        }
      }
    },
    [account, signer]
  );

  return { createSnapshot, loading };
}
