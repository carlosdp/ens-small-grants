import { Button, FieldSet, Helper, Input } from '@ensdomains/thorin';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import BackButton from '../components/BackButton';
import { Card } from '../components/atoms';
import { useCreateGrant } from '../hooks';

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

export function CreateProposal() {
  const { roundId } = useParams<{ roundId: string }>();

  const { handleSubmit, register } = useForm<FormInput>();
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

      navigate('/');
    },
    [createGrant, navigate, roundId]
  );

  const onCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <>
      <BackButton to={`/rounds/${roundId}`} />
      <Container>
        {isFormDisabled && (
          <Helper alignment="horizontal" type="warning">
            You must connect your wallet to submit a proposal.
          </Helper>
        )}
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <FieldSet legend="Submit a Proposal" disabled={isFormDisabled}>
            <Input label="Title" id="title" required {...register('title', { required: true })} />
            <Input
              label="Short Description"
              id="shortDescription"
              required
              {...register('shortDescription', { required: true })}
            />
            <Input
              label="Full Text"
              id="fullText"
              required
              {...register('fullText', { required: true, minLength: 300 })}
            />
            <ButtonContainer>
              <Button onClick={onCancel} disabled={isFormDisabled} variant="secondary" shadowless>
                Cancel
              </Button>
              <Button type="submit" disabled={isFormDisabled} shadowless>
                Publish
              </Button>
            </ButtonContainer>
          </FieldSet>
        </form>
      </Container>
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
