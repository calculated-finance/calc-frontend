// import { QueryClientProvider } from '@tanstack/react-query';
// import { renderHook } from '@testing-library/react-hooks';
// import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
// import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
// import { defaultDenom } from '@utils/defaultDenom';
// import { getTestQueryClient } from '@helpers/test/testQueryClient';
// import { ChildrenProp } from '@helpers/ChildrenProp';
// import { getMarsParamsAddress, getRedBankAddress } from '@helpers/chains';
// import { useMarket } from '.'; // Adjust the import path to where your useMarket hook is

// jest.mock('@helpers/chains', () => ({
//   getMarsParamsAddress: jest.fn(),
//   getRedBankAddress: jest.fn(),
// }));

// describe('useMarket hook', () => {
//   // reset mocks
//   it('calls client.queryContractSmart with correct parameters when client and resultingDenom are defined', async () => {
//     const mockClient = {
//       queryContractSmart: jest.fn().mockResolvedValue({ value: 'market' }),
//     };
//     const mockResultingDenom = { ...defaultDenom, id: 'mockDenomId' };

//     useCosmWasmClient.setState({ client: mockClient as unknown as CosmWasmClient });

//     const wrapper = ({ children }: ChildrenProp) => (
//       <QueryClientProvider client={getTestQueryClient()}>{children}</QueryClientProvider>
//     );
//     const { result, waitFor } = renderHook(() => useMarket(mockResultingDenom), {
//       wrapper,
//     });

//     await waitFor(() => result.current.isSuccess);

//     expect(result.current.data).toEqual({ value: 'market' });

//     expect(mockClient.queryContractSmart).toHaveBeenCalledWith(getRedBankAddress(), {
//       market: { denom: 'mockDenomId' },
//     });

//     expect(mockClient.queryContractSmart).toHaveBeenCalledWith(getMarsParamsAddress(), {
//       asset_params: { denom: 'mockDenomId' },
//     });
//   });

//   it('returns nothing if market not found', async () => {
//     const mockClient = {
//       queryContractSmart: jest.fn().mockRejectedValue(new Error()),
//     };
//     const mockResultingDenom = { ...defaultDenom, id: 'mockDenomId' };

//     useCosmWasmClient.setState({ client: mockClient as unknown as CosmWasmClient });

//     const wrapper = ({ children }: ChildrenProp) => (
//       <QueryClientProvider client={getTestQueryClient()}>{children}</QueryClientProvider>
//     );
//     const { result, waitFor } = renderHook(() => useMarket(mockResultingDenom), {
//       wrapper,
//     });

//     await waitFor(() => result.current.isSuccess);

//     expect(result.current.data).toEqual({});

//     expect(mockClient.queryContractSmart).toHaveBeenCalledWith(getRedBankAddress(), {
//       market: { denom: 'mockDenomId' },
//     });

//     expect(mockClient.queryContractSmart).toHaveBeenCalledWith(getMarsParamsAddress(), {
//       asset_params: { denom: 'mockDenomId' },
//     });
//   });
// });
