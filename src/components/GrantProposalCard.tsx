import { Button, Typography } from '@ensdomains/thorin';
import { useHref, useLinkClickHandler } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ClickHandler, Grant } from '../types';
import { getTimeDifferenceString, voteCountFormatter } from '../utils';
import Profile from './Profile';
import { Card } from './atoms';

export type GrantProposalCardProps = {
  roundId: string | number;
  proposal: Grant;
  inProgress?: boolean;
};

const StyledCard = styled(Card)(
  () => css`
    align-items: flex-start;
    width: 100%;
    height: 100%;
  `
);

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    font-weight: bold;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  `
);

const Description = styled(Typography)(
  () => css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  `
);

const VotesAndButton = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 100%;
  `
);

function GrantProposalCard({ roundId, proposal }: GrantProposalCardProps) {
  const to = `/rounds/${roundId}/proposals/${proposal.id}`;
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to);

  return (
    <StyledCard>
      <Profile
        address={proposal.proposer}
        subtitle={`${getTimeDifferenceString(proposal.createdAt, new Date())} ago`}
      />
      <Title>{proposal.title}</Title>
      <Description>{proposal.description}</Description>
      <div style={{ flexGrow: 1 }} />
      <VotesAndButton>
        <Typography>
          <b>{voteCountFormatter.format(proposal.voteCount!)}</b> votes
        </Typography>
        <div>
          <Button size="small" shadowless as="a" href={href} onClick={handleClick as unknown as ClickHandler}>
            View Proposal
          </Button>
        </div>
      </VotesAndButton>
    </StyledCard>
  );
}

export default GrantProposalCard;
