import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
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


  (useWallet as jest.Mock).mockImplementation(() => ({
    address: 'kujiratestwallet',
    connected: true,
    signingClient: {
      execute: mockExecute,
      signAndBroadcast: mockSignAndBroadcast,
    },
  }));
}
