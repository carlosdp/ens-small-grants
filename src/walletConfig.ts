import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, provider } = configureChains([chain.mainnet], [publicProvider()]);

export const { connectors } = getDefaultWallets({
  appName: 'ENS DAO Small Grants',
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
