import { Button, FieldSet, Helper, Input, mq, Spinner, Textarea, Typography } from '@ensdomains/thorin';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import BackButton from '../components/BackButton';
import { Card } from '../components/atoms';
import { useCreateGrant, useRounds } from '../hooks';

type FormInput = {
  title: string;
  shortDescription: string;
  fullText: string;
};

const Container = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['4']};

    width: 100%;
    height: 100%;
  `
);

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
  `
);

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    color: ${theme.colors.textTertiary};
    text-align: right;
    flex-grow: 1;
    width: 100%;

    b {
      color: ${theme.colors.text};
      font-weight: bold;
      display: block;
    }

    ${mq.md.min(css`
      font-size: ${theme.space['9']};
      text-align: left;
      b {
        display: inline-block;
      }
    `)}
  `
);

export function CreateProposal() {
  const { roundId } = useParams<{ roundId: string }>();
  const to = `/rounds/${roundId}`;

  const { round, isLoading } = useRounds(roundId!);
  const { handleSubmit, register, getFieldState, formState } = useForm<FormInput>({
    mode: 'onBlur',
  });
  const { address } = useAccount();
  const { createGrant } = useCreateGrant();
  const navigate = useNavigate();

  const isFormDisabled = !address;

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async data => {
      await createGrant({
        roundId: Number.parseInt(roundId!),
        title: data.title,
        description: data.shortDescription,
        fullText: data.fullText,
      });

      navigate(to, { state: { submission: true } });
    },
    [createGrant, navigate, roundId, to]
  );

  const onCancel = useCallback(() => {
    navigate(to);
  }, [navigate, to]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!round) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <BackButton
        to={`/rounds/${roundId}`}
        title={
          <Title>
            <b>{round.title}</b> Round {round.round}
          </Title>
        }
      />
      <Container>
        {isFormDisabled && (
          <Helper alignment="horizontal" type="warning">
            You must connect your wallet to submit a proposal.
          </Helper>
        )}
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <FieldSet legend="Submit a Proposal" disabled={isFormDisabled}>
            <Input
              label="Title"
              showDot
              id="title"
              validated={getFieldState('title', formState).isDirty}
              required
              {...register('title', { required: true })}
            />
            <Input
              label="TL;DR"
              showDot
              id="shortDescription"
              required
              validated={getFieldState('shortDescription', formState).isDirty}
              {...register('shortDescription', { required: true })}
            />
            <Textarea
              label="Description"
              id="fullText"
              required
              showDot
              validated={getFieldState('fullText', formState).isDirty}
              {...register('fullText', {
                required: true,
                validate: value => (value.length >= 300 ? undefined : 'Please enter at least 300 characters'),
              })}
              error={getFieldState('fullText', formState).error?.message}
            />
            <ButtonContainer>
              <Button onClick={onCancel} disabled={isFormDisabled} variant="secondary" shadowless>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isFormDisabled || Object.keys(formState.errors || {}).length > 0}
                shadowless
              >
                Publish
              </Button>
            </ButtonContainer>
          </FieldSet>
        </form>
      </Container>
      <div style={{ flexGrow: 1 }} />
    </>
  );

  // return (
  //   <Box alignItems="center" flexDirection="column" display="flex">
  //     <Box flexDirection="column" gap="42px" display="flex" width="100%" maxWidth={MAX_WIDTH}>
  //       {!account && (
  //         <Alert borderRadius="12px" status="warning">
  //           <AlertIcon />
  //           You must connect your wallet to submit a proposal.
  //         </Alert>
  //       )}

  //       <FormControl isDisabled={isFormDisabled} isInvalid={!!errors.title} isRequired={true}>
  //         <FormLabel htmlFor="title">Title</FormLabel>
  //         <Input id="title" {...register('title', { required: true })} />
  //         {errors.title && <FormErrorMessage>Title is required</FormErrorMessage>}
  //       </FormControl>
  //       <FormControl isDisabled={isFormDisabled} isInvalid={!!errors.shortDescription} isRequired={true}>
  //         <FormLabel htmlFor="shortDescription">Short Description</FormLabel>
  //         <Input id="shortDescription" {...register('shortDescription', { required: true })} />
  //         {errors.shortDescription && <FormErrorMessage>Short Description is required.</FormErrorMessage>}
  //       </FormControl>
  //       <FormControl isDisabled={isFormDisabled} isInvalid={!!errors.fullText} isRequired={true}>
  //         <FormLabel htmlFor="fullText">Full Proposal Text</FormLabel>
  //         <FormHelperText>
  //           You can use{' '}
  //           <Link href="https://www.markdownguide.org/basic-syntax/" target="_blank">
  //             markdown syntax
  //           </Link>{' '}
  //           to format your proposal
  //         </FormHelperText>
  //         <Textarea id="fullText" {...register('fullText', { required: true, minLength: 300 })} />
  //         {errors.fullText && (
  //           <FormErrorMessage>
  //             {errors.fullText?.type === 'minLength'
  //               ? 'Full Proposal Text must be at least 300 characters'
  //               : 'Full Proposal Text is required'}
  //           </FormErrorMessage>
  //         )}
  //       </FormControl>
  //       <Flex justifyContent="flex-end" gap="12px">
  //         <Button onClick={onCancel} variant="secondary">
  //           Cancel
  //         </Button>
  //         <Button disabled={isFormDisabled} onClick={handleSubmit(onSubmit)}>
  //           Publish
  //         </Button>
  //       </Flex>
  //     </Box>
  //   </Box>
  // );
}
