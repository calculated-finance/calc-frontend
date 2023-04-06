import { useWallet } from '@wizard-ui/react';

export function mockUseWallet(
  mockQuery: jest.Mock,
  mockExecute?: jest.Mock,
  mockGetBalance?: jest.Mock,
  mockSignAndBroadcast?: jest.Mock,
) {
  (useWallet as jest.Mock).mockImplementation(() => ({
    address: 'kujitestwallet',
    connected: true,
    client: {
      queryContractSmart: mockQuery,
      getBalance: mockGetBalance,
    },
    signingClient: {
      execute: mockExecute,
      signAndBroadcast: mockSignAndBroadcast,
    },
  }));
}
