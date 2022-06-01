import { Box, Text, Button } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Routes, Route } from 'react-router-dom';

import { useCreateRound } from './hooks';

function Home() {
  const { createRound } = useCreateRound();

  const create = () => {
    createRound('Round 1', 'The first ENS round');
  };

  return (
    <Box width="100%" maxWidth="936px">
      <Text>Content Here</Text>
      <Button onClick={create}>Create Round</Button>
    </Box>
  );
}

function App() {
  return (
    <Box alignItems="center" flexDirection="column" display="flex" width="100%">
      <Box justifyContent="center" display="flex" width="100%" paddingTop="36px" paddingBottom="36px">
        <Box alignItems="center" flexDirection="row" display="flex" width="100%" maxWidth="936px">
          <Text>Web3 Starter</Text>
          <Box marginLeft="auto">
            <ConnectButton showBalance={false} />
          </Box>
        </Box>
      </Box>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Box>
  );
}

export default App;
