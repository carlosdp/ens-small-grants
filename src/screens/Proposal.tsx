import { Heading, Spinner, Typography } from '@ensdomains/thorin';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import BackButton from '../components/BackButton';
import Profile from '../components/Profile';
import VoteSection from '../components/VoteSection';
import { useGrants, useRounds } from '../hooks';
import { getTimeDifferenceString } from '../utils';

const Description = styled(Heading)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-weight: lighter;
  `
);

const TitleContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  `
);

const ContentGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 4fr minmax(${theme.space['72']}, 1fr);
    gap: ${theme.space['32']};
  `
);

const InnerContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['4']};

    width: 100%;
  `
);

const MarkdownWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;

    gap: ${theme.space['4']};

    p {
      font-weight: ${theme.fontWeights.medium};
    }

    h4 {
      font-size: ${theme.fontSizes.large};
    }

    h3 {
      font-size: ${theme.fontSizes.extraLarge};
    }

    h2 {
      font-size: ${theme.fontSizes.headingThree};
    }

    h1 {
      font-size: ${theme.fontSizes.headingTwo};
    }

    ul {
      list-style: disc;
      line-height: ${theme.lineHeights['1.5']};
    }

    a {
      color: ${theme.colors.indigo};
    }
  `
);

function Proposal() {
  const { id, roundId } = useParams<{ id: string; roundId: string }>();
  const { round, isLoading: roundLoading } = useRounds(roundId!);
  const { grant, isLoading } = useGrants(round, id!);

  if (isLoading || roundLoading || !grant || !round) {
    return <Spinner size="large" />;
  }

  return (
    <>
      <BackButton to={`/rounds/${roundId}`} />
      <ContentGrid>
        <InnerContent>
          <TitleContainer>
            <Heading level="1">{grant.title}</Heading>
            <Description>{grant.description}</Description>
          </TitleContainer>
          <Profile address={grant.proposer} subtitle={`${getTimeDifferenceString(grant.createdAt, new Date())} ago`} />
          <MarkdownWrapper>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <Typography as="h1">{children}</Typography>,
                h2: ({ children }) => <Typography as="h2">{children}</Typography>,
                h3: ({ children }) => <Typography as="h3">{children}</Typography>,
                h4: ({ children }) => <Typography as="h4">{children}</Typography>,
                h5: ({ children }) => <Typography as="h5">{children}</Typography>,
                h6: ({ children }) => <Typography as="h6">{children}</Typography>,
                p: ({ children }) => <Typography as="p">{children}</Typography>,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {grant.fullText}
            </ReactMarkdown>
          </MarkdownWrapper>
        </InnerContent>
        <VoteSection round={round} proposal={grant} />
      </ContentGrid>
      <div style={{ flexGrow: 1 }} />
    </>
  );

  // if (loading || roundLoading || !grant || !round) {
  //   return (
  //     <Center>
  //       <Spinner />
  //     </Center>
  //   );
  // }

  // return (
  //   <Box alignItems="center" flexDirection="column" display="flex">
  //     <Box
  //       flexWrap="wrap"
  //       flexDirection={{ base: 'column', md: 'row' }}
  //       gap="32px"
  //       display="flex"
  //       width="100%"
  //       maxWidth={MAX_WIDTH}
  //     >
  //       <Box flex={2}>
  //         <Button as={ReactRouterLink} leftIcon={<ArrowLeftOutlined />} to={`/rounds/${round.id}`} variant="link">
  //           Back to all proposals
  //         </Button>
  //         <Box alignItems="center" gap="16px" display="flex" marginTop="32px">
  //           <Box
  //             alignItems="center"
  //             justifyContent="center"
  //             display="flex"
  //             overflow="hidden"
  //             width="40px"
  //             height="40px"
  //             background="primary-purple"
  //             borderRadius={40}
  //           >
  //             <Avatar width={'40px'} height={'40px'} src={ensAvatar as string} />
  //           </Box>
  //           <Text fontSize="14px" fontWeight="bold">
  //             {ensName || clipAddress(grant.proposer)}
  //           </Text>
  //         </Box>
  //         <Box flexDirection="column" gap="22px" display="flex" marginTop="34px">
  //           <Text fontSize="34px" fontWeight="bold">
  //             {grant.title}
  //           </Text>
  //           <Text fontSize="24px" fontWeight="bold">
  //             {grant.description}
  //           </Text>
  //           <ReactMarkdown
  //             components={{
  //               h1: ({ children }) => (
  //                 <Heading as="h1" variant="md-h1">
  //                   {children}
  //                 </Heading>
  //               ),
  //               h2: ({ children }) => (
  //                 <Heading as="h2" variant="md-h2">
  //                   {children}
  //                 </Heading>
  //               ),
  //               h3: ({ children }) => (
  //                 <Heading as="h3" variant="md-h3">
  //                   {children}
  //                 </Heading>
  //               ),
  //               h4: ({ children }) => (
  //                 <Heading as="h4" variant="md-h4">
  //                   {children}
  //                 </Heading>
  //               ),
  //               h5: ({ children }) => (
  //                 <Heading as="h5" variant="md-h5">
  //                   {children}
  //                 </Heading>
  //               ),
  //               h6: ({ children }) => (
  //                 <Heading as="h6" variant="md-h6">
  //                   {children}
  //                 </Heading>
  //               ),
  //               p: ({ children }) => <Text variant="md-p">{children}</Text>,
  //               a: ({ children, href }) => (
  //                 <Link href={href} target="_blank" variant="md-a">
  //                   {children}
  //                 </Link>
  //               ),
  //             }}
  //           >
  //             {grant.full_text}
  //           </ReactMarkdown>
  //         </Box>
  //       </Box>
  //       <Box alignItems="flex-start" justifyContent="flex-end" flex={1} display="flex">
  //         <VoteSection round={round} proposal={grant} />
  //       </Box>
  //     </Box>
  //   </Box>
  // );
}

export default Proposal;
