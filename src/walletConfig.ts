import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { QueryClient } from '@tanstack/react-query';
import { chain, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, provider } = configureChains([chain.rinkeby], [publicProvider()]);

export const { connectors } = getDefaultWallets({
  appName: 'ENS DAO Small Grants',
  chains,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  queryClient,
});
