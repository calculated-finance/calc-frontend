import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useWallet } from '@hooks/useWallet';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useCosmWasmClientStore } from '@hooks/useCosmWasmClientStore';

// jest.mock('@hooks/useCosmWasmClient');

export function mockUseWallet(
  mockQuery?: jest.Mock,
  mockExecute?: jest.Mock,
  mockGetBalance?: jest.Mock,
  mockSignAndBroadcast?: jest.Mock,
  connected = true,
) {
  useCosmWasmClientStore.setState({
    client: {
      queryContractSmart: mockQuery,
      getBalance: mockGetBalance,
    } as unknown as CosmWasmClient,
  });

  // (useCosmWasmClient as jest.Mock).mockImplementation(() => ({
  //   getCosmWasmClient: jest.fn().mockResolvedValue({
  //     queryContractSmart: mockQuery,
  //     getBalance: mockGetBalance,
  //   } as unknown as CosmWasmClient),
  // }));

  (useWallet as jest.Mock).mockImplementation(() => ({
    address: 'kujiratestwallet',
    connected,
    getSigningClient: jest.fn().mockResolvedValue({
      execute: mockExecute,
      signAndBroadcast: mockSignAndBroadcast,
    }),
  }));
}
