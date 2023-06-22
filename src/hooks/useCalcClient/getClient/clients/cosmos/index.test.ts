import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import getCosmosClient from '.';

describe('CosmosClient', () => {
  let mockClient: CosmWasmClient;

  beforeEach(() => {
    mockClient = {
      queryContractSmart: jest.fn(),
    } as unknown as CosmWasmClient;
  });

  describe('fetchStrategy', () => {
    it('should fetch strategy with correct query', async () => {
      const address = 'address1';
      const vaultId = 'vault1';
      const expectedResponse = {
        vault: { id: vaultId, data: 'dummy_data' },
      };
      (mockClient.queryContractSmart as jest.Mock).mockResolvedValue(expectedResponse);

      const cosmosClient = getCosmosClient(address, mockClient);
      const result = await cosmosClient.fetchStrategy(vaultId);

      expect(mockClient.queryContractSmart).toHaveBeenCalledWith(address, {
        get_vault: {
          vault_id: vaultId,
        },
      });
      expect(result).toEqual(expectedResponse.vault);
    });

    it('should handle errors gracefully', async () => {
      const address = 'address1';
      const vaultId = 'vault1';
      (mockClient.queryContractSmart as jest.Mock).mockRejectedValue(new Error('Error fetching data'));

      const cosmosClient = getCosmosClient(address, mockClient);

      await expect(cosmosClient.fetchStrategy(vaultId)).rejects.toThrow('Error fetching data');
    });
  });

  describe('getCosmosClient', () => {
    it('should return an object with fetchStrategy function', () => {
      const address = 'address1';
      const cosmosClient = getCosmosClient(address, mockClient);

      expect(cosmosClient).toHaveProperty('fetchStrategy');
      expect(typeof cosmosClient.fetchStrategy).toBe('function');
    });
  });
});
