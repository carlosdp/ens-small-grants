import { useCallback, useState } from 'react';
import { useSigner, useAccount } from 'wagmi';

import { functionRequest } from '../supabase';

const domain = {
  name: 'ENS Grants',
  version: '1',
  chainId: 1,
};

const types = {
  CreateSnapshotRequest: [{ name: 'roundId', type: 'uint256' }],
};

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
        const snapshotData = {
          roundId: args.roundId,
        };

        try {
          setLoading(true);

          // @ts-ignore
          const signature = await signer._signTypedData(domain, types, snapshotData);

          return functionRequest('create_snapshot', {
            data: snapshotData,
            signature,
          });
        } finally {
          setLoading(false);
        }
      }
    },
    [account, signer]
  );

  return { createSnapshot, loading };
}
