// import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
// import { ChainId } from '@hooks/useChain/Chains';
// import { BrowserProvider } from 'ethers';
// import { getChainContractAddress } from '@helpers/chains';
// import getClient from '.';
// import getCosmosClient from './clients/cosmos';
// import getEVMClient from './clients/evm';

// jest.mock('./clients/evm/');
// jest.mock('./clients/cosmos/');
// jest.mock('@helpers/chains');

// describe('getClient', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // it('returns EVM client for Moonbeam chain when evmProvider is available', () => {
//   //   const evmProvider = {} as BrowserProvider;
//   //   (getEVMClient as jest.Mock).mockReturnValue('mockEVMClient');
//   //   const client = getClient(Chains.Moonbeam, null, evmProvider);
//   //   expect(getEVMClient).toHaveBeenCalled();
//   //   expect(client).toBe('mockEVMClient');
//   // });

//   // it('returns null if evmProvider is not present for Moonbeam chain', () => {
//   //   const client = getClient(Chains.Moonbeam, null, null);
//   //   expect(client).toBeNull();
//   // });

//   it('returns Cosmos client for Kujira chain when cosmClient is available', () => {
//     const cosmClient = {} as CosmWasmClient;
//     (getChainContractAddress as jest.Mock).mockReturnValue('kujira-address');
//     (getCosmosClient as jest.Mock).mockReturnValue('mockCosmosClient');
//     const client = getClient('kaiyo-1', cosmClient, null);
//     expect(getCosmosClient).toHaveBeenCalled();
//     expect(client).toBe('mockCosmosClient');
//   });

//   it('returns Cosmos client for Osmosis chain when cosmClient is available', () => {
//     const cosmClient = {} as CosmWasmClient;
//     (getChainContractAddress as jest.Mock).mockReturnValue('osmosis-address');
//     (getCosmosClient as jest.Mock).mockReturnValue('mockCosmosClient');
//     const client = getClient('osmosis-1', cosmClient, null);
//     expect(getCosmosClient).toHaveBeenCalled();
//     expect(client).toBe('mockCosmosClient');
//   });

//   it('returns null if cosmClient is not present for Kujira chain', () => {
//     const client = getClient('kaiyo-1', null, null);
//     expect(client).toBeNull();
//   });

//   it('throws error for unsupported chain', () => {
//     expect(() => getClient('UnsupportedChain' as ChainId, null, null)).toThrow('Unsupported chain');
//   });
// });
