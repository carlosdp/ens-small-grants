import { useCallback, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';

import { functionRequest } from '../supabase';

const domain = {
  name: 'ENS Grants',
  version: '1',
  chainId: 4,
};

const types = {
  Grant: [
    { name: 'address', type: 'address' },
    { name: 'roundId', type: 'uint256' },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'fullText', type: 'string' },
  ],
};

export type CreateGrantArgs = {
  roundId: number;
  title: string;
  description: string;
  fullText: string;
};

export function useCreateGrant() {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const createGrant = useCallback(
    async (args: CreateGrantArgs) => {
      if (signer && address) {
        const grantData = {
          roundId: args.roundId,
          address: address?.toLowerCase(),
          title: args.title,
          description: args.description,
          fullText: args.fullText,
        };

        try {
          setLoading(true);

          // @ts-ignore
          const signature = await signer._signTypedData(domain, types, grantData);

          return functionRequest('create_grant', {
            grantData,
            signature,
          });
        } finally {
          setLoading(false);
        }
      } else {
        throw new Error('Your wallet must connected to propose a grant.');
      }
    },
    [address, signer]
  );

  return { createGrant, loading };
}
