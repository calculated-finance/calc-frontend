import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useWallet } from '@hooks/useWallet';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';

export function mockUseWallet(
  mockQuery?: jest.Mock,
  mockExecute?: jest.Mock,
  mockGetBalance?: jest.Mock,
  mockSignAndBroadcast?: jest.Mock,
  connected = true,
) {
  useCosmWasmClient.setState({
    client: {
      queryContractSmart: mockQuery,
      getBalance: mockGetBalance,
    } as unknown as CosmWasmClient,
  });

  (useWallet as jest.Mock).mockImplementation(() => ({
    address: 'kujiratestwallet',
    connected,
    signingClient: {
      execute: mockExecute,
      signAndBroadcast: mockSignAndBroadcast,
    },
  }));
}
