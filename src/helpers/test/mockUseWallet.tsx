import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains, useChainStore } from '@hooks/useChain';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useWallet } from '@hooks/useWallet';

export function mockUseWallet(
  mockQuery?: jest.Mock,
  mockExecute?: jest.Mock,
  mockGetBalance?: jest.Mock,
  mockSignAndBroadcast?: jest.Mock,
) {
  useCosmWasmClient.setState({
    client: {
      queryContractSmart: mockQuery,
      getBalance: mockGetBalance,
    } as unknown as CosmWasmClient,
  });

  useChainStore.setState({
    chain: Chains.Kujira,
  });

  (useWallet as jest.Mock).mockImplementation(() => ({
    address: 'kujitestwallet',
    connected: true,
    signingClient: {
      execute: mockExecute,
      signAndBroadcast: mockSignAndBroadcast,
    },
  }));
}
