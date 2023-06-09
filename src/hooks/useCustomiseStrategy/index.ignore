// import { renderHook, act } from '@testing-library/react-hooks';
// import { useWallet } from '@hooks/useWallet';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { getChainContractAddress } from '@helpers/chains';
// import * as Sentry from '@sentry/react';
// import { Chains } from '@hooks/useChain/Chains';
// import { useAnalytics } from '../useAnalytics';
// import { useChain } from '../useChain';
// import { getExecuteMsg } from '../useCreateVault/getCreateVaultExecuteMsg';
// import { useCustomiseStrategy } from '.';
// import { getUpdateVaultMessage } from './getUpdateVaultMessage';

// jest.mock('@hooks/useWallet');
// jest.mock('../useAnalytics');
// jest.mock('../useChain');
// jest.mock('@tanstack/react-query', () => ({
//   useMutation: jest.fn(),
//   useQueryClient: jest.fn(),
// }));
// jest.mock('@sentry/react', () => ({
//   captureException: jest.fn(),
// }));

// describe('useCustomiseStrategy', () => {
//   beforeEach(() => {
//     (useAnalytics as jest.Mock).mockReturnValue({
//       track: jest.fn(),
//     });
//     (useChain as jest.Mock).mockReturnValue({
//       chain: Chains.Kujira,
//     });
//   });
//   it.only('should throw error when address is null or empty', async () => {
//     (useWallet as jest.Mock).mockReturnValue({
//       address: null,
//       signingClient: {},
//     });

//     const { result } = renderHook(() => useCustomiseStrategy());

//     expect(result.current.error).toEqual(new Error('address is null or empty'));
//   });

//   it('should throw error when client is null or empty', async () => {
//     (useWallet as jest.Mock).mockReturnValue({
//       address: 'test-address',
//       signingClient: null,
//     });

//     const { result } = renderHook(() => useCustomiseStrategy());

//     expect(result.current.error).toEqual(new Error('client is null or empty'));
//   });

//   it('should throw error when chain is null or empty', async () => {
//     (useWallet as jest.Mock).mockReturnValue({
//       address: 'test-address',
//       signingClient: {},
//     });
//     (useChain as jest.Mock).mockReturnValue({ chain: null });

//     const { result } = renderHook(() => useCustomiseStrategy());

//     expect(result.current.error).toEqual(new Error('chain is null or empty'));
//   });

//   it('should throw error when strategy owner does not match address', async () => {
//     (useWallet as jest.Mock).mockReturnValue({
//       address: 'test-address',
//       signingClient: {},
//     });
//     (useChain as jest.Mock).mockReturnValue({ chain: Chains.Kujira });
//     const variables = { strategy: { owner: 'different-address' } };

//     const { result } = renderHook(() => useCustomiseStrategy());

//     await act(async () => {
//       result.current.mutate(variables as any as any);
//     });

//     expect(result.current.error).toEqual(new Error('You are not the owner of this strategy'));
//   });

//   it('should call signAndBroadcast on successful case', async () => {
//     (useWallet as jest.Mock).mockReturnValue({
//       address: 'test-address',
//       signingClient: {
//         signAndBroadcast: jest.fn(),
//       },
//     });
//     (useChain as jest.Mock).mockReturnValue({ chain: Chains.Kujira });
//     (useQueryClient as jest.Mock).mockReturnValue({
//       invalidateQueries: jest.fn(),
//     });

//     const variables = {
//       strategy: { owner: 'test-address', id: 'test-id' },
//       values: { slippageTolerance: 'test-slippage' },
//     };

//     const mockSignAndBroadcast = useWallet!().signingClient!.signAndBroadcast;

//     const { result } = renderHook(() => useCustomiseStrategy());

//     await act(async () => {
//       result.current.mutate(variables as any);
//     });

//     const expectedMsg = getExecuteMsg(
//       getUpdateVaultMessage(variables as any, Chains.Kujira),
//       undefined,
//       'test-address',
//       getChainContractAddress(Chains.Kujira),
//     );

//     expect(mockSignAndBroadcast).toHaveBeenCalledWith('test-address', [expectedMsg], 'auto');
//   });

//   it('should capture exception on error', async () => {
//     const mockCaptureException = Sentry.captureException as jest.Mock;
//     (useWallet as jest.Mock).mockReturnValue({
//       address: 'test-address',
//       signingClient: {},
//     });
//     (useChain as jest.Mock).mockReturnValue({ chain: Chains.Kujira });

//     const mockUseMutation = useMutation as jest.Mock;
//     mockUseMutation.mockReturnValue({
//       mutate: (variables: any, { onError }: any) => {
//         onError(new Error('Test Error'), variables);
//       },
//     });

//     const variables = {
//       strategy: { owner: 'test-address', id: 'test-id' },
//       values: { slippageTolerance: 'test-slippage' },
//     };

//     const { result } = renderHook(() => useCustomiseStrategy());

//     await act(async () => {
//       result.current.mutate(variables as any);
//     });

//     expect(mockCaptureException).toHaveBeenCalled();
//   });
// });
