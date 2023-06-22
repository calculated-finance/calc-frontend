import { BrowserProvider } from 'ethers';
import getVaultContract from 'src/interfaces/evm/getVaultContract';
import { transformToStrategy } from './transformToStrategy';
import getEVMClient from '.';

jest.mock('src/interfaces/evm/getVaultContract');
jest.mock('./transformToStrategy');

describe('EVMClient', () => {
  let mockProvider: BrowserProvider;
  let mockVaultContract: any;

  beforeEach(() => {
    mockVaultContract = {
      getConfig: jest.fn(),
      getBalance: jest.fn(),
    };

    (getVaultContract as jest.Mock).mockReturnValue(mockVaultContract);

    mockProvider = {} as BrowserProvider;
  });

  describe('fetchStrategyEVM', () => {
    it('should fetch strategy and transform to Strategy', async () => {
      const id = 'vault1';
      const config = { dummyConfig: 'config' };
      const balance = '12345';
      const transformedStrategy = { id, config, balance };

      mockVaultContract.getConfig.mockResolvedValue(config);
      mockVaultContract.getBalance.mockResolvedValue(balance);
      (transformToStrategy as jest.Mock).mockReturnValue(transformedStrategy);

      const evmClient = getEVMClient(mockProvider);
      const result = await evmClient.fetchStrategy(id);

      expect(getVaultContract).toHaveBeenCalledWith(mockProvider, id);
      expect(mockVaultContract.getConfig).toHaveBeenCalled();
      expect(mockVaultContract.getBalance).toHaveBeenCalled();
      expect(transformToStrategy).toHaveBeenCalledWith(config, balance, id);
      expect(result).toEqual(transformedStrategy);
    });

    it('should handle errors gracefully', async () => {
      const id = 'vault1';
      mockVaultContract.getConfig.mockRejectedValue(new Error('Error fetching config'));

      const evmClient = getEVMClient(mockProvider);

      await expect(evmClient.fetchStrategy(id)).rejects.toThrow('Error fetching config');
    });
  });

  describe('getEVMClient', () => {
    it('should return an object with fetchStrategy function', () => {
      const evmClient = getEVMClient(mockProvider);

      expect(evmClient).toHaveProperty('fetchStrategy');
      expect(typeof evmClient.fetchStrategy).toBe('function');
    });
  });
});
