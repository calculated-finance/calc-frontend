import { ChainId } from '@hooks/useChain/Chains';
import { getChainContractAddress, getRedBankAddress } from '@helpers/chains';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import { dcaInStrategyViewModal as mockStrategy } from 'src/fixtures/strategy';
import { Strategy } from '@models/Strategy';
import { getStrategyPostSwapType } from '.';

describe('destination helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStrategyPostSwapType', () => {
    it('should return GenerateYield if destination address is equal to Mars Address', () => {
      const strategy: Strategy = {
        ...mockStrategy,
        rawData: {
          ...mockStrategy.rawData,
          destinations: [
            {
              address: getRedBankAddress(),
              allocation: '1.0',
              msg: null,
            },
          ],
        },
      };
      const chain = 'osmosis-1';

      const result = getStrategyPostSwapType(strategy, chain);
      expect(result).toBe(PostPurchaseOptions.GenerateYield);
    });

    it('should return Stake if destination address is equal to Chain Contract Address and validator address exists', () => {
      const strategy: Strategy = {
        ...mockStrategy,
        rawData: {
          ...mockStrategy.rawData,
          destinations: [
            {
              address: getChainContractAddress('osmosis-1'),
              allocation: '1.0',
              msg: Buffer.from(JSON.stringify({ z_delegate: { validator_address: 'validator_address' } })).toString(
                'base64',
              ),
            },
          ],
        },
      };
      const chain = 'osmosis-1';

      const result = getStrategyPostSwapType(strategy, chain);
      expect(result).toBe(PostPurchaseOptions.Stake);
    });

    it('should return Reinvest if destination address is equal to Chain Contract Address and validator address does not exist', () => {
      const strategy: Strategy = {
        ...mockStrategy,
        rawData: {
          ...mockStrategy.rawData,
          destinations: [
            {
              address: getChainContractAddress('osmosis-1'),
              allocation: '1.0',
              msg: Buffer.from(JSON.stringify({})).toString('base64'),
            },
          ],
        },
      };
      const chain = 'osmosis-1';

      const result = getStrategyPostSwapType(strategy, chain);
      expect(result).toBe(PostPurchaseOptions.Reinvest);
    });

    it('should return SendToWallet if destination address is not equal to Mars Address or Chain Contract Address', () => {
      const strategy: Strategy = {
        ...mockStrategy,
        rawData: {
          ...mockStrategy.rawData,
          destinations: [
            {
              address: 'address',
              allocation: '1.0',
              msg: null,
            },
          ],
        },
      };
      const chain = 'osmosis-1';

      const result = getStrategyPostSwapType(strategy, chain);
      expect(result).toBe(PostPurchaseOptions.SendToWallet);
    });
  });
});
