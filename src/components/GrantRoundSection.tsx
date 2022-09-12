import { Button, Spinner, Typography } from '@ensdomains/thorin';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { useGrants } from '../hooks';
import type { ClickHandler, Round } from '../types';
import { BannerContainer } from './BannerContainer';
import GrantProposalCard from './GrantProposalCard';

const GrantsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['4']};

    width: 100%;
  `
);

export type GrantRoundSectionProps = Round & {
  randomiseGrants?: boolean;
  createProposalHref?: string;
  createProposalClick?: ClickHandler;
};

function GrantRoundSection({
  randomiseGrants,
  createProposalHref,
  createProposalClick,
  ...round
}: GrantRoundSectionProps) {
  const { grants: _grants, isLoading } = useGrants(round);
  const grants = useMemo(() => {
    if (!_grants || !randomiseGrants) return _grants;
    return _grants.sort(() => 0.5 - Math.random());
  }, [_grants, randomiseGrants]);

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (!grants || grants.length === 0) {
    return (
      <BannerContainer>
        <div>
          <Typography>No proposals here yet</Typography>
          <Typography>You can submit your own proposal until the submissions close.</Typography>
        </div>
        <div>
          <Button as="a" href={createProposalHref} onClick={createProposalClick}>
            Submit Proposal
          </Button>
        </div>
      </BannerContainer>
    );
  }

  return (
    <GrantsContainer>
      <Button as="a" href={createProposalHref} onClick={createProposalClick}>
        Submit Proposal
      </Button>
      {grants &&
        grants.map(g => (
          <GrantProposalCard
            proposal={g}
            roundId={round.id}
            votingStarted={round.votingStart < new Date()}
            inProgress={round.votingEnd > new Date()}
            key={g.id}
          />
        ))}
    </GrantsContainer>
  );
}

export default GrantRoundSection;
