import { Typography } from '@ensdomains/thorin';
import styled, { css } from 'styled-components';

export const Card = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: ${theme.space['4']};
    gap: ${theme.space['3']};

    background-color: ${theme.colors.background};
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
    border-radius: ${theme.radii.extraLarge};
  `
);

export const TextWithHighlight = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    b {
      color: ${theme.colors.text};
    }
  `
);
