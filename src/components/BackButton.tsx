import { ArrowCircleSVG, Typography } from '@ensdomains/thorin';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Container = styled.div(
  () => css`
    width: 100%;
  `
);

const BackButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};

    color: ${theme.colors.purple};
    font-size: ${theme.fontSizes.extraLarge};

    svg {
      transform: rotate(180deg);
      width: ${theme.space['6']};
      height: ${theme.space['6']};
    }
  `
);

const BackButton = (props: React.ComponentProps<typeof Link>) => {
  return (
    <Container>
      <div style={{ width: 'min-content' }}>
        <Link {...props}>
          <BackButtonContainer>
            <ArrowCircleSVG />
            <Typography>Back</Typography>
          </BackButtonContainer>
        </Link>
      </div>
    </Container>
  );
};

export default BackButton;
