import { Button, Spinner, Typography } from '@ensdomains/thorin';
import { formatEther } from 'ethers/lib/utils';
import { useHref, useLinkClickHandler, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import BackButton from '../components/BackButton';
import GrantRoundSection from '../components/GrantRoundSection';
import { useRounds } from '../hooks';
import { ClickHandler } from '../types';
import { getTimeDifferenceString } from '../utils';

const Container = styled.div(
  () => css`
    width: 100%;
  `
);

const HeadingContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;

    width: 100%;
  `
);

const TitleContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: max-content;
    white-space: nowrap;
  `
);

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.space['9']};
    color: ${theme.colors.textTertiary};

    b {
      color: ${theme.colors.text};
      font-weight: bold;
    }
  `
);

const Subtitle = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    color: ${theme.colors.textTertiary};

    b {
      color: ${theme.colors.indigo};
      font-weight: bold;
    }
  `
);

const VoteDetailsContainer = styled.div(
  () => css`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  `
);

const VotesTypography = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.large};
    color: ${theme.colors.textTertiary};

    b {
      color: ${theme.colors.text};
    }
  `
);

const VoteTimeTypography = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    color: ${theme.colors.red};
    font-weight: bold;
  `
);

const NoProposalsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: ${theme.space['2']};

    & > div {
      font-size: ${theme.fontSizes.extraLarge};
      font-weight: bold;
    }
  `
);

export const Round = () => {
  const { id } = useParams<{ id: string }>();
  const { round, isLoading } = useRounds(id!);

  const to = '/rounds/2/proposals/create';
  const href = useHref(to);
  const onClick = useLinkClickHandler(to);

  if (isLoading || !round) {
    return <Spinner size="large" />;
  }

  // Check if round[0] is active (in proposals or voting stage)
  const isActiveRound = round.votingEnd > new Date();
  const isVotingRound = round.proposalEnd < new Date();

  let upperVoteMsg: React.ReactNode;
  let lowerVoteMsg: React.ReactNode;

  if (!isActiveRound) {
    upperVoteMsg = (
      <>
        <b>{Intl.NumberFormat('en', { notation: 'compact' }).format(round.snapshot!.scoresTotal!)}</b> total votes
      </>
    );
    lowerVoteMsg = `Voting closed ${getTimeDifferenceString(round.votingEnd, new Date())} ago`;
  } else {
    if (isVotingRound) {
      upperVoteMsg = (
        <>
          <b>{Intl.NumberFormat('en', { notation: 'compact' }).format(round.snapshot!.scoresTotal!)}</b> votes so far
        </>
      );
      lowerVoteMsg = `Voting closes in ${getTimeDifferenceString(new Date(), round.votingEnd)}`;
    } else {
      upperVoteMsg = 'No votes so far';
      lowerVoteMsg = `Submissions close in ${getTimeDifferenceString(new Date(), round.proposalEnd)}`;
    }
  }

  return (
    <>
      <BackButton to="/" />
      <Container>
        <HeadingContainer>
          <TitleContainer>
            <Title>
              <b>{round.title}</b> Round {round.round}
            </Title>
            <Subtitle>
              The <b>Top {round.maxWinnerCount}</b> voted proposals of this round get{' '}
              <b>{formatEther(round.allocationTokenAmount).replace(/\..*/, '')} ETH</b> each
            </Subtitle>
          </TitleContainer>
          <VoteDetailsContainer>
            <VotesTypography>{upperVoteMsg}</VotesTypography>
            <VoteTimeTypography>{lowerVoteMsg}</VoteTimeTypography>
          </VoteDetailsContainer>
        </HeadingContainer>
      </Container>
      {isVotingRound ? (
        <GrantRoundSection randomiseGrants={isActiveRound && isVotingRound} {...round} />
      ) : (
        <NoProposalsContainer>
          <Typography>No proposals yet.</Typography>
          <Button as="a" href={href} onClick={onClick as unknown as ClickHandler}>
            Submit Proposal
          </Button>
        </NoProposalsContainer>
      )}
      <div style={{ flexGrow: 1 }} />
    </>
  );
};
