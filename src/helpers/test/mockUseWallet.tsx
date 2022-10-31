import { useWallet } from '@wizard-ui/react';

export function mockUseWallet(mockQuery: any, mockExecute: any, mockGetBalance?: any) {
  (useWallet as jest.Mock).mockImplementation(() => ({
    address: 'kujitestwallet',
    connected: true,
    client: {
      queryContractSmart: mockQuery,
      getBalance: mockGetBalance,
    },
    signingClient: {
      execute: mockExecute,
    },
  }));
}
