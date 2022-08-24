import { Typography } from '@ensdomains/thorin';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Logo from '../assets/Logo.svg';
import Anchor from './Anchor';

const HeaderContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `
);

const LogoAndText = styled(Link)(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `
);

const LogoIcon = styled.img(
  ({ theme }) => css`
    width: ${theme.space['32']};
  `
);

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    white-space: nowrap;
    font-weight: bold;
    margin-bottom: ${theme.space['1']};
  `
);

const NavButtons = styled.nav(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['8']};

    a {
      color: ${theme.colors.textTertiary};

      &:hover,
      &:active {
        color: ${theme.colors.accent};
      }
    }
  `
);

const Header = () => {
  return (
    <HeaderContainer>
      <LogoAndText to="/">
        <LogoIcon src={Logo} />
        <Title>Small Grants</Title>
      </LogoAndText>
      <NavButtons>
        <Anchor to="/how-it-works">How it works</Anchor>
        <Anchor to="/rounds">All rounds</Anchor>
        <ConnectButton chainStatus="none" showBalance={false} />
      </NavButtons>
    </HeaderContainer>
  );
};

export default Header;
