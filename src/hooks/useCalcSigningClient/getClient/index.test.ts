import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { getEVMSigningClient } from './clients/evm';
import { getCosmosSigningClient } from './clients/cosmos';
import getClient from '.';

jest.mock('./clients/evm', () => ({
  getEVMSigningClient: jest.fn(),
}));

jest.mock('./clients/cosmos', () => ({
  getCosmosSigningClient: jest.fn(),
}));

describe('getClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns EVM client for Moonbeam chain when evmProvider and evmSigner are available', () => {
    const evmSigner = {} as JsonRpcSigner;
    const mockEVMClient = { name: 'Mocked EVM Client' };
    (getEVMSigningClient as jest.Mock).mockReturnValue(mockEVMClient);

    const client = getClient(Chains.Moonbeam, evmSigner, null);
    expect(client).toEqual(mockEVMClient);
    expect(getEVMSigningClient).toHaveBeenCalledWith(evmSigner);
  });

  it('returns Cosmos client for Kujira chain when cosmSigner is available', () => {
    const cosmSigner = {} as SigningCosmWasmClient;
    const mockCosmosClient = { name: 'Mocked Cosmos Client' };
    (getCosmosSigningClient as jest.Mock).mockReturnValue(mockCosmosClient);

    const client = getClient(Chains.Kujira, null, cosmSigner);
    expect(client).toEqual(mockCosmosClient);
    expect(getCosmosSigningClient).toHaveBeenCalledWith(cosmSigner, Chains.Kujira);
  });

  it('returns Cosmos client for Osmosis chain when cosmSigner is available', () => {
    const cosmSigner = {} as SigningCosmWasmClient;
    const mockCosmosClient = { name: 'Mocked Cosmos Client' };
    (getCosmosSigningClient as jest.Mock).mockReturnValue(mockCosmosClient);

    const client = getClient(Chains.Osmosis, null, cosmSigner);
    expect(client).toEqual(mockCosmosClient);
    expect(getCosmosSigningClient).toHaveBeenCalledWith(cosmSigner, Chains.Osmosis);
  });

  it('returns null if cosmSigner is not present for Kujira chain', () => {
    const client = getClient(Chains.Kujira, null, null);
    expect(client).toBeNull();
  });

  it('throws error for unsupported chain', () => {
    expect(() => getClient('UnsupportedChain' as Chains, null, null)).toThrow('Unsupported chain');
  });
});
