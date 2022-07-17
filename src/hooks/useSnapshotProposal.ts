import snapshot from '@snapshot-labs/snapshot.js';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSigner, useAccount } from 'wagmi';

export type SnapshotVote = {
  id: string;
  voter: string;
  vp: number;
  choice: number;
};

export type SnapshotProposal = {
  id: string;
  title: string;
  space: string;
  choices: string[];
  scores: number[];
  scores_state: string;
  votes: SnapshotVote[];
};

const QUERY = `
    query GetSnapshotProposal($proposalId: String!) {
      proposal(id: $proposalId) {
        id
        title
        space
        choices
        scores
        scores_state
      }

      votes(first: 100, where: { proposal: $proposalId }) {
        id
        voter
        vp
        choice
      }
    }
`;

const snapshotClient = new snapshot.Client712('https://hub.snapshot.org');

export function useSnapshotProposal(proposalId: string) {
  const [proposal, setProposal] = useState<SnapshotProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('https://hub.snapshot.org/grapqhl', {
          method: 'POST',
          body: JSON.stringify({ query: QUERY, variables: { proposalId } }),
          headers: {
            'content-type': 'application/json',
          },
        });

        const body = await res.json();

        setProposal({ ...body.data.proposal, votes: body.data.votes });
      } finally {
        setLoading(false);
      }
    })();
  }, [proposalId]);

  const vote = useCallback(
    async (choiceId: number) => {
      if (proposal && account?.address) {
        await snapshotClient.vote(signer as unknown as ethers.providers.Web3Provider, account.address, {
          type: 'single-choice',
          space: proposal?.space,
          proposal: proposalId,
          choice: choiceId,
        });
      }
    },
    [proposalId, account, proposal, signer]
  );

  return { proposal, loading, vote };
}
