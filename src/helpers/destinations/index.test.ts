import { Destination } from 'src/interfaces/generated-osmosis/execute';
import { Chains } from '@hooks/useChain/Chains';
import { getChainContractAddress, getMarsAddress } from '@helpers/chains';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import { dcaInStrategy as mockStrategy } from 'src/fixtures/strategy';
import { Strategy } from '@models/Strategy';
import { buildCallbackDestinations, getStrategyPostSwapType } from '.';

describe('buildCallbackDestinations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an auto-stake destination when autoStakeValidator is provided', () => {
    const senderAddress = 'sender_address';
    const autoStakeValidator = 'validator_address';

    const result = buildCallbackDestinations(Chains.Osmosis, autoStakeValidator, null, null, senderAddress, null);
    const expectedDestination: Destination = {
      address: getChainContractAddress(Chains.Osmosis),
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          z_delegate: {
            delegator_address: senderAddress,
            validator_address: autoStakeValidator,
          },
        }),
      ).toString('base64'),
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns a recipient destination when recipientAccount is provided', () => {
    const senderAddress = 'sender_address';
    const recipientAccount = 'recipient_account';

    const result = buildCallbackDestinations(Chains.Osmosis, null, recipientAccount, null, senderAddress, null);
    const expectedDestination: Destination = {
      address: recipientAccount,
      allocation: '1.0',
      msg: null,
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns a reinvest destination when reinvestStrategy is provided', () => {
    const senderAddress = 'sender_address';
    const reinvestStrategy = 'reinvest_strategy';
    const chain = Chains.Osmosis;

    const result = buildCallbackDestinations(chain, null, null, null, senderAddress, reinvestStrategy);
    const expectedDestination: Destination = {
      address: getChainContractAddress(chain),
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          deposit: {
            vault_id: reinvestStrategy,
            address: senderAddress,
          },
        }),
      ).toString('base64'),
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns a reinvest destination when reinvestStrategy is provided for kujira', () => {
    const senderAddress = 'sender_address';
    const reinvestStrategy = 'reinvest_strategy';
    const chain = Chains.Kujira;

    const result = buildCallbackDestinations(chain, null, null, null, senderAddress, reinvestStrategy);
    const expectedDestination: Destination = {
      address: getChainContractAddress(chain),
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          deposit: {
            vault_id: reinvestStrategy,
            address: senderAddress,
          },
        }),
      ).toString('base64'),
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns a mars destination when yieldOption is "mars"', () => {
    const senderAddress = 'sender_address';
    const yieldOption = 'mars';
    const marsAddress = getMarsAddress();

    const result = buildCallbackDestinations(Chains.Osmosis, null, null, yieldOption, senderAddress, null);
    const expectedDestination: Destination = {
      address: marsAddress,
      allocation: '1.0',
      msg: Buffer.from(
        JSON.stringify({
          deposit: {
            on_behalf_of: senderAddress,
          },
        }),
      ).toString('base64'),
    };

    expect(result).toEqual([expectedDestination]);
  });

  it('returns undefined when no input is provided', () => {
    const senderAddress = 'sender_address';

    const result = buildCallbackDestinations(Chains.Osmosis, null, null, null, senderAddress, null);

    expect(result).toBeUndefined();
  });

  describe('getStrategyPostSwapType', () => {
    it('should return GenerateYield if destination address is equal to Mars Address', () => {
      const strategy: Strategy = {
        ...mockStrategy,
        destinations: [
          {
            address: getMarsAddress(),
            allocation: '1.0',
            msg: null,
          },
        ],
      };
      const chain = Chains.Osmosis;

      const result = getStrategyPostSwapType(strategy, chain);
      expect(result).toBe(PostPurchaseOptions.GenerateYield);
    });

    it('should return Stake if destination address is equal to Chain Contract Address and validator address exists', () => {
      const strategy: Strategy = {
        ...mockStrategy,
        destinations: [
          {
            address: getChainContractAddress(Chains.Osmosis),
            allocation: '1.0',
            msg: Buffer.from(JSON.stringify({ z_delegate: { validator_address: 'validator_address' } })).toString(
              'base64',
            ),
          },
        ],
      };
      const chain = Chains.Osmosis;

      const result = getStrategyPostSwapType(strategy, chain);
      expect(result).toBe(PostPurchaseOptions.Stake);
    });

    it('should return Reinvest if destination address is equal to Chain Contract Address and validator address does not exist', () => {
      const strategy: Strategy = {
        ...mockStrategy,
        destinations: [
          {
            address: getChainContractAddress(Chains.Osmosis),
            allocation: '1.0',
            msg: Buffer.from(JSON.stringify({})).toString('base64'),
          },
        ],
      };
      const chain = Chains.Osmosis;

      const result = getStrategyPostSwapType(strategy, chain);
      expect(result).toBe(PostPurchaseOptions.Reinvest);
    });

    it('should return SendToWallet if destination address is not equal to Mars Address or Chain Contract Address', () => {
      const strategy: Strategy = {
        ...mockStrategy,
        destinations: [
          {
            address: 'address',
            allocation: '1.0',
            msg: null,
          },
        ],
      };
      const chain = Chains.Osmosis;

      const result = getStrategyPostSwapType(strategy, chain);
      expect(result).toBe(PostPurchaseOptions.SendToWallet);
    });
  });
});
