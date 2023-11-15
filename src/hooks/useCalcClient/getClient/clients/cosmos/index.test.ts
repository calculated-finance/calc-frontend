import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StrategyEvent } from '@hooks/StrategyEvent';
import getCalcClient, { GET_EVENTS_LIMIT } from '.';
import { transformToStrategyCosmos } from './transformToStrategy';

jest.mock('./transformToStrategy');

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
      (transformToStrategyCosmos as jest.Mock).mockReturnValue('strategy');

      const cosmosClient = getCalcClient(address, mockClient);
      const result = await cosmosClient.fetchStrategy(vaultId);

      expect(mockClient.queryContractSmart).toHaveBeenCalledWith(address, {
        get_vault: {
          vault_id: vaultId,
        },
      });
      expect(result).toEqual('strategy');

      expect(transformToStrategyCosmos).toHaveBeenCalledWith(expectedResponse.vault);
    });

    it('should handle errors gracefully', async () => {
      const address = 'address1';
      const vaultId = 'vault1';
      (mockClient.queryContractSmart as jest.Mock).mockRejectedValue(new Error('Error fetching data'));

      const cosmosClient = getCalcClient(address, mockClient);

      await expect(cosmosClient.fetchStrategy(vaultId)).rejects.toThrow('Error fetching data');
    });
  });

  describe('fetchStrategyEvents', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    const address = 'address1';
    const vaultId = 'vault1';

    const mockEvent = { id: '1' } as unknown as StrategyEvent;

    it('should fetch events recursively if events length equals GET_EVENTS_LIMIT', async () => {
      // Mock queryContractSmart to return GET_EVENTS_LIMIT number of events

      (mockClient.queryContractSmart as jest.Mock).mockResolvedValueOnce({
        events: Array(GET_EVENTS_LIMIT).fill(mockEvent),
      });

      (mockClient.queryContractSmart as jest.Mock).mockResolvedValueOnce({
        events: [],
      });

      const cosmosClient = getCalcClient(address, mockClient);

      const result = await cosmosClient.fetchStrategyEvents(vaultId);

      // Expect queryContractSmart to have been called twice (recursive call)
      expect(mockClient.queryContractSmart).toHaveBeenCalledTimes(2);
      // Expect the result to be an array of length GET_EVENTS_LIMIT
      expect(result).toHaveLength(GET_EVENTS_LIMIT);
    });

    it('should fetch events recursively if events length equals GET_EVENTS_LIMIT - 1', async () => {
      // Mock queryContractSmart to return GET_EVENTS_LIMIT - 1 number of events
      (mockClient.queryContractSmart as jest.Mock).mockResolvedValueOnce({
        events: Array(GET_EVENTS_LIMIT - 1).fill(mockEvent),
      });

      (mockClient.queryContractSmart as jest.Mock).mockResolvedValueOnce({
        events: [],
      });
      const cosmosClient = getCalcClient(address, mockClient);

      const result = await cosmosClient.fetchStrategyEvents(vaultId);

      // Expect queryContractSmart to have been called twice (recursive call)
      expect(mockClient.queryContractSmart).toHaveBeenCalledTimes(2);
      // Expect the result to be an array of length GET_EVENTS_LIMIT - 1
      expect(result).toHaveLength(GET_EVENTS_LIMIT - 1);
    });

    it('should handle errors', async () => {
      (mockClient.queryContractSmart as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      const cosmosClient = getCalcClient(address, mockClient);

      try {
        await cosmosClient.fetchStrategyEvents(vaultId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Error');
      }
    });
  });

  describe('getCosmosClient', () => {
    it('should return an object with fetchStrategy function', () => {
      const address = 'address1';
      const cosmosClient = getCalcClient(address, mockClient);

      expect(cosmosClient).toHaveProperty('fetchStrategy');
      expect(typeof cosmosClient.fetchStrategy).toBe('function');
    });
  });
});
