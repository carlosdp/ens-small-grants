import { Spinner } from '@ensdomains/thorin';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { useGrants } from '../hooks';
import type { Round } from '../types';
import GrantProposalCard from './GrantProposalCard';

// const roundProgress = (round: Round) => {
//   const now = moment();
//   if (round.proposal_start > now) {
//     return 0;
//   } else if (round.proposal_end > now) {
//     return 30;
//   } else if (round.voting_start > now) {
//     return 50;
//   } else if (round.voting_end > now) {
//     return 70;
//   } else {
//     return 100;
//   }
// };

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
};

function GrantRoundSection({ randomiseGrants, ...round }: GrantRoundSectionProps) {
  const { grants: _grants, isLoading } = useGrants(round);
  const grants = useMemo(() => {
    if (!_grants || !randomiseGrants) return _grants;
    return _grants.sort(() => 0.5 - Math.random());
  }, [_grants, randomiseGrants]);

  if (isLoading) {
    return <Spinner size="large" />;
  }

  return (
    <GrantsContainer>
      {grants &&
        grants.map(g => (
          <GrantProposalCard proposal={g} roundId={round.id} inProgress={round.votingEnd > new Date()} key={g.id} />
        ))}
    </GrantsContainer>
  );

  // const [expandProposals, setExpandProposals] = useState(false);

  // const allocationAmount = round.allocation_token_amount
  //   ? ethers.utils.formatEther(round.allocation_token_amount.div(round.max_winner_count))
  //   : '0';
  // const { grants, loading } = useGrants(round);
  // const randomizedGrantsArray = useMemo(() => grants?.sort(() => Math.random() - 0.5) || null, [grants]);

  // const navigate = useNavigate();

  // const onPressSubmitProposal = useCallback(() => {
  //   navigate('/create_proposal');
  // }, [navigate]);

  // const onToggleExpandProposals = useCallback(() => {
  //   setExpandProposals(!expandProposals);
  // }, [expandProposals]);

  // const now = moment();
  // const beforeStart = now < round.proposal_start;
  // const inProgress = round.proposal_start < now && round.voting_end > now;
  // const proposalsOpen = round.proposal_start < now && round.proposal_end > now;

  // const proposalsSection = loading ? (
  //   <Center minHeight="250px">
  //     <Spinner />
  //   </Center>
  // ) : (
  //   <>
  //     <Collapse in={inProgress || expandProposals}>
  //       <Flex justifyContent="center" flexWrap="wrap" gap="24px" paddingTop="48px">
  //         {randomizedGrantsArray &&
  //           randomizedGrantsArray.map(g => (
  //             <GrantProposalCard key={g.id} roundId={round.id} proposal={g} inProgress={inProgress} />
  //           ))}
  //       </Flex>
  //     </Collapse>

  //     {inProgress && proposalsOpen && (!grants || grants.length === 0) && (
  //       <Flex alignItems="center" flexDirection="column" gap="24px">
  //         <Image height="161px" src={proposalSrc} />
  //         <Text>Be the first to add a proposal</Text>
  //         <Button onClick={onPressSubmitProposal}>Submit Proposal</Button>
  //       </Flex>
  //     )}
  //     {beforeStart && (
  //       <Flex alignItems="center" flexDirection="column" gap="24px">
  //         <Image height="161px" src={proposalSrc} />
  //         <Text>Proposals will be accepted at round start time</Text>
  //       </Flex>
  //     )}
  //   </>
  // );

  // return (
  //   <Box
  //     marginRight={{ base: '-40px', sm: '-40px', md: '-60px' }}
  //     marginLeft={{ base: '-40px', sm: '-40px', md: '-60px' }}
  //     padding={{ base: '32px 18px', sm: '40px', md: '60px' }}
  //     background={inProgress ? 'purple-medium' : 'purple-light'}
  //     borderRadius={{ base: '0px', md: '20px' }}
  //   >
  //     <Flex
  //       alignItems="center"
  //       justifyContent="space-between"
  //       flexDirection={{ base: 'column', sm: 'row' }}
  //       gap="1rem"
  //       width="100%"
  //     >
  //       <Flex alignItems="center" justifyContent={{ base: 'center', sm: 'unset' }} flexWrap="wrap">
  //         <Text fontSize="md" fontWeight="bold">
  //           {round.title}
  //         </Text>

  //         {beforeStart ? (
  //           <Box width="20px" height="20px" />
  //         ) : (
  //           <Box
  //             alignItems="center"
  //             justifyContent="center"
  //             display="flex"
  //             width="20px"
  //             height="20px"
  //             marginRight="6px"
  //             marginLeft="6px"
  //             background={inProgress ? 'secondary-green' : 'primary-purple'}
  //             borderRadius={40}
  //           >
  //             {inProgress ? <Image height="12px" src={boltSrc} /> : <Image height="9px" src={checkmarkWhiteSrc} />}
  //           </Box>
  //         )}

  //         <Text marginEnd="6px" fontSize="md" fontWeight="bold">
  //           {allocationAmount}Ξ
  //         </Text>
  //         <Text fontSize="sm"> for each of the top {round.max_winner_count} voted projects</Text>
  //       </Flex>

  //       {inProgress ? (
  //         <>
  //           {proposalsOpen && (
  //             <Button fontSize="16px" onClick={onPressSubmitProposal}>
  //               Submit Proposal
  //             </Button>
  //           )}
  //         </>
  //       ) : (
  //         !beforeStart && (
  //           <Button onClick={onToggleExpandProposals} variant="link">
  //             {expandProposals ? 'Show less' : 'Show proposals'}
  //           </Button>
  //         )
  //       )}
  //     </Flex>

  //     {inProgress ? (
  //       <Box width="100%" paddingTop="42px">
  //         <ProgressBar progressNumber={roundProgress(round)} totalNumber={100} />
  //         <Box justifyContent="space-between" flexDirection="row" gap="0.75rem" display="flex" fontSize={['sm', 'md']}>
  //           <Box>
  //             <Text>Proposals Open</Text>
  //           </Box>
  //           <Box>
  //             <Text>Voting Open</Text>
  //           </Box>
  //           <Box>
  //             <Text>Voting Closed</Text>
  //           </Box>
  //         </Box>
  //       </Box>
  //     ) : beforeStart ? (
  //       <Flex gap="6px" paddingTop="16px">
  //         <Text fontSize="sm" fontWeight="bold">
  //           Proposal Period Begins
  //         </Text>
  //         <Text fontSize="sm">{round.proposal_start.format('MMMM D, YYYY hh:mma')}</Text>
  //       </Flex>
  //     ) : (
  //       <Flex gap="6px" paddingTop="16px">
  //         <Text fontSize="sm" fontWeight="bold">
  //           Voting Ended
  //         </Text>
  //         <Text fontSize="sm">{round.voting_end.format('MMMM D, YYYY')}</Text>
  //       </Flex>
  //     )}

  //     {proposalsSection}
  //   </Box>
  // );
}

export default GrantRoundSection;
