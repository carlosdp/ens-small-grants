import { useCallback } from 'react';
import { useSigner, useAccount } from 'wagmi';

import { functionRequest } from '../supabase';

const domain = {
  name: 'ENS Grants',
  version: '1',
  chainId: 1,
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

export function useCreateGrant() {
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const createGrant = useCallback(
    async (roundId: number, title: string, description: string, fullText: string) => {
      if (signer && account) {
        const grantData = {
          roundId,
          address: account.address,
          title,
          description,
          fullText,
        };

        // @ts-ignore
        const signature = await signer._signTypedData(domain, types, grantData);

        return functionRequest('create_grant', {
          grantData,
          signature,
        });
      }
    },
    [account, signer]
  );

  return { createGrant };
}