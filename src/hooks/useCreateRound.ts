import { BigNumber } from 'ethers';
import { useCallback, useState } from 'react';

import { functionRequest } from '../supabase';

export type CreateRoundArgs = {
  name: string;
  description?: string | null;
  proposalStart: Date;
  proposalEnd: Date;
  votingStart: Date;
  votingEnd: Date;
};

const dateToTimestamp = (d: Date) => BigNumber.from(Math.floor(d.getTime() / 1000)).toString();

export function useCreateRound() {
  const [loading, setLoading] = useState(false);

  const createRound = useCallback((args: CreateRoundArgs) => {
    try {
      setLoading(true);
      return functionRequest('create_round', {
        name: args.name,
        description: args.description,
        proposalStart: dateToTimestamp(args.proposalStart),
        propsalEnd: dateToTimestamp(args.proposalEnd),
        votingStart: dateToTimestamp(args.votingStart),
        votingEnd: dateToTimestamp(args.votingEnd),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { createRound, loading };
}
