import snapshot from '@snapshot-labs/snapshot.js';
import { useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useAccount, useQuery, useSigner } from 'wagmi';

import { SnapshotGrant, SnapshotProposal, SnapshotVote } from '../types';
import { camelCaseToUpperCase, replaceKeysWithFunc } from '../utils';

type SnapshotResponse = {
  data: {
    proposal: {
      id: string;
      title: string;
      choices: string[];
      scores: number[];
      scores_state: string;
      snapshot: string;
      space: {
        id: string;
      };
      strategies: {
        network: string;
        name: string;
        params: object;
      }[];
    };
    votes: SnapshotVote[];
    currentVote?: SnapshotVote[];
  };
};

const QUERY = `
    query GetSnapshotProposal($proposalId: String!, $currentUser: String, $hasUser: Boolean!) {
      proposal(id: $proposalId) {
        id
        title
        choices
        scores
        scores_state
        snapshot
        space {
          id
        }
        strategies {
          network
          name
          params
        }
      }

      votes(first: 1000, where: { proposal: $proposalId }) {
        id
        voter
        vp
        choice
      }

      currentVote: votes(first: 1, where: { proposal: $proposalId, voter: $currentUser }) @include(if: $hasUser) {
        id
        voter
        vp
        choice
      }
    }
`;

const snapshotClient = new snapshot.Client712('https://testnet.snapshot.org');

export function useSnapshotProposal(proposalId: string) {
  const queryClient = useQueryClient();

  const { data: signer } = useSigner();
  const { address } = useAccount();

  const { data: proposal, isLoading } = useQuery(['proposal', proposalId, address], async () => {
    const res = await fetch('https://testnet.snapshot.org/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: QUERY,
        variables: { proposalId, currentUser: address, hasUser: !!address },
      }),
      headers: {
        'content-type': 'application/json',
      },
    });

    const body: SnapshotResponse = await res.json();

    let votesAvailable: number | null = null;

    if (address) {
      const scores = await snapshot.utils.getScores(
        body.data.proposal.space.id,
        body.data.proposal.strategies,
        body.data.proposal.strategies[0].network,
        [address],
        body.data.proposal.snapshot
      );

      votesAvailable = Math.floor(scores[0][address] ?? 0);

      if (body.data.currentVote?.length === 0) body.data.currentVote = undefined;
    }

    const grants: SnapshotGrant[] =
      body.data.proposal.choices.map((choice, i) => ({
        choiceId: i,
        grantId: Number.parseInt(choice.split(' - ')[0]),
        voteCount: body.data.proposal.scores[i],
        voteStatus: body.data.proposal.scores_state === 'final',
        voteSamples: body.data.votes
          .filter(v => v.choice === i + 1)
          .sort((a, b) => {
            if (a.voter === address) return -1;
            if (b.voter === address) return 1;
            return b.vp - a.vp;
          }),
        currentVotes: body.data.currentVote?.[0].choice === i ? body.data.currentVote[0].vp : 0,
      })) || [];

    return {
      ...replaceKeysWithFunc(body.data.proposal, camelCaseToUpperCase),
      votes: body.data.votes,
      votesAvailable,
      currentVote: (body.data.currentVote && body.data.currentVote[0]) || null,
      grants,
    } as SnapshotProposal;
  });

  const vote = useCallback(
    async (choiceId: number[]) => {
      if (address && proposal?.space.id) {
        await snapshotClient.vote(signer as unknown as ethers.providers.Web3Provider, address, {
          space: proposal?.space.id,
          proposal: proposalId,
          type: 'approval',
          choice: choiceId,
        });
        queryClient.invalidateQueries(['proposal', proposalId, address]);
      }
    },
    [address, proposal?.space.id, signer, proposalId, queryClient]
  );

  return { proposal, isLoading, vote };
}
