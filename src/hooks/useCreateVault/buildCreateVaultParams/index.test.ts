import { TransactionType } from '@components/TransactionType';
import { DenomInfo } from '@utils/DenomInfo';
import { defaultDenom } from '@utils/defaultDenom';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { TestnetDenoms } from '@models/Denom';
import { getMarsAddress } from '@helpers/chains';
import { Destination, ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { dcaInStrategyViewModal } from 'src/fixtures/strategy';
import { mockChainConfig } from 'src/fixtures/mockChainConfig';
import { mockConfig } from 'src/fixtures/mockConfig';
import { Config } from 'src/interfaces/v2/generated/response/get_config';
import {
  BuildCreateVaultContext,
  buildCallbackDestinations,
  buildCreateVaultMsg,
  getExecutionInterval,
  getReceiveAmount,
  getSlippageWithoutTrailingZeros,
} from '.';

describe('build params', () => {
  describe('buildCallbackDestinations', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns an auto-stake destination when autoStakeValidator is provided', () => {
      const senderAddress = dcaInStrategyViewModal.owner;
      const autoStakeValidator = 'validator_address';

      const result = buildCallbackDestinations(
        mockChainConfig,
        autoStakeValidator,
        null,
        null,
        senderAddress,
        undefined,
      );
      const expectedDestination: Destination = {
        address: mockChainConfig.contractAddress,
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
      const senderAddress = dcaInStrategyViewModal.owner;
      const recipientAccount = 'recipient_account';

      const result = buildCallbackDestinations(mockChainConfig, null, recipientAccount, null, senderAddress, undefined);
      const expectedDestination: Destination = {
        address: recipientAccount,
        allocation: '1.0',
        msg: null,
      };

      expect(result).toEqual([expectedDestination]);
    });

    it('returns a reinvest destination when reinvestStrategy is provided', () => {
      const senderAddress = dcaInStrategyViewModal.owner;
      const reinvestStrategy = '1';

      const result = buildCallbackDestinations(mockChainConfig, null, null, null, senderAddress, reinvestStrategy);
      const expectedDestination: Destination = {
        address: mockChainConfig.contractAddress,
        allocation: '1.0',
        msg: Buffer.from(
          JSON.stringify({
            deposit: {
              vault_id: reinvestStrategy,
              address: senderAddress,
            },
          } as ExecuteMsg),
        ).toString('base64'),
      };

      expect(result).toEqual([expectedDestination]);
    });

    it('returns a reinvest destination when reinvestStrategy is provided for kujira', () => {
      const senderAddress = dcaInStrategyViewModal.owner;
      const reinvestStrategy = '1';

      const result = buildCallbackDestinations(mockChainConfig, null, null, null, senderAddress, reinvestStrategy);
      const expectedDestination: Destination = {
        address: mockChainConfig.contractAddress,
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
      const senderAddress = dcaInStrategyViewModal.owner;
      const yieldOption = 'mars';
      const marsAddress = getMarsAddress();

      const result = buildCallbackDestinations(mockChainConfig, null, null, yieldOption, senderAddress, undefined);
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

      const result = buildCallbackDestinations(mockChainConfig, null, null, null, senderAddress, undefined);

      expect(result).toBeUndefined();
    });
  });

  describe('getSlippageWithoutTrailingZeros', () => {
    it('returns "0" when slippage is 0', () => {
      expect(getSlippageWithoutTrailingZeros(0)).toBe('0');
    });

    it('returns "0.001" when slippage is 0.1', () => {
      expect(getSlippageWithoutTrailingZeros(0.1)).toBe('0.001');
    });

    it('returns "0.005" when slippage is 0.5', () => {
      expect(getSlippageWithoutTrailingZeros(0.5)).toBe('0.005');
    });

    it('returns "0.011" when slippage is 1.1', () => {
      expect(getSlippageWithoutTrailingZeros(1.1)).toBe('0.011');
    });

    it('returns "0.1" when slippage is 10', () => {
      expect(getSlippageWithoutTrailingZeros(10)).toBe('0.1');
    });

    it('returns "-0.001" when slippage is -0.1', () => {
      expect(getSlippageWithoutTrailingZeros(-0.1)).toBe('-0.001');
    });

    it('returns "-0.005" when slippage is -0.5', () => {
      expect(getSlippageWithoutTrailingZeros(-0.5)).toBe('-0.005');
    });

    it('returns "-0.011" when slippage is -1.1', () => {
      expect(getSlippageWithoutTrailingZeros(-1.1)).toBe('-0.011');
    });

    it('returns "-0.1" when slippage is -10', () => {
      expect(getSlippageWithoutTrailingZeros(-10)).toBe('-0.1');
    });
  });

  describe('getReceiveAmount', () => {
    it('calculates correct receive amount for Buy transaction', () => {
      const initialDenom: DenomInfo = {
        ...defaultDenom,
        id: '',
        deconversion: (amount) => amount * 1000000,
        significantFigures: 6,
      };
      const resultingDenom: DenomInfo = {
        ...defaultDenom,
        id: '',
        significantFigures: 18,
      };
      const result = getReceiveAmount(initialDenom, 1.2, 5.0, resultingDenom, TransactionType.Buy);
      expect(result).toEqual('240000000000000000');
    });

    it('calculates correct receive amount for Sell transaction', () => {
      const initialDenom: DenomInfo = {
        ...defaultDenom,
        id: '',
        deconversion: (amount) => amount * 1000000,
        significantFigures: 6,
      };
      const resultingDenom: DenomInfo = {
        ...defaultDenom,
        id: '',
        significantFigures: 18,
      };
      const result = getReceiveAmount(initialDenom, 1.2, 5.0, resultingDenom, TransactionType.Sell);
      expect(result).toEqual('6000000000000000000');
    });

    it('handles deconversion factors correctly', () => {
      const initialDenom: DenomInfo = {
        ...defaultDenom,
        id: '',
        deconversion: (amount) => amount * 2000000,
        significantFigures: 6,
      };
      const resultingDenom: DenomInfo = {
        ...defaultDenom,
        id: '',
        significantFigures: 18,
      };
      const result = getReceiveAmount(initialDenom, 1.2, 5.0, resultingDenom, TransactionType.Buy);
      expect(result).toEqual('480000000000000000');
    });
  });

  describe('getExecutionInterval', () => {
    it('should return the custom execution interval with seconds when executionIntervalIncrement is not null or undefined and greater than 0', () => {
      const testCases = [
        { interval: 'minute' as ExecutionIntervals, increment: 2, expected: 120 },
        { interval: 'half_hourly' as ExecutionIntervals, increment: 1, expected: 1800 },
        { interval: 'hourly' as ExecutionIntervals, increment: 3, expected: 10800 },
        { interval: 'half_daily' as ExecutionIntervals, increment: 1, expected: 43200 },
        { interval: 'daily' as ExecutionIntervals, increment: 2, expected: 172800 },
        { interval: 'weekly' as ExecutionIntervals, increment: 1, expected: 604800 },
        { interval: 'fortnightly' as ExecutionIntervals, increment: 1, expected: 1209600 },
        { interval: 'monthly' as ExecutionIntervals, increment: 1, expected: 2419200 },
      ];
      testCases.forEach(({ interval, increment, expected }) => {
        const result = getExecutionInterval(interval, increment);
        expect(result).toEqual({ custom: { seconds: expected } });
      });
    });
  });

  describe('buildCreateVaultMsg', () => {
    const initialDenom = { id: TestnetDenoms.AXL, ...defaultDenom };
    const resultingDenom = { id: TestnetDenoms.Kuji, ...defaultDenom };

    it('should return correct message when neither dca plus or swap adjustment is set', () => {
      const context: BuildCreateVaultContext = {
        initialDenom,
        resultingDenom,
        timeInterval: { increment: 1, interval: 'daily' },
        swapAmount: 1.2,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1.0,
        destinationConfig: {
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyId: undefined,
        },
      };

      const msg = buildCreateVaultMsg(mockChainConfig, mockConfig, context);
      expect(msg).toEqual({
        create_vault: {
          destinations: undefined,
          label: '',
          minimum_receive_amount: undefined,
          performance_assessment_strategy: undefined,
          slippage_tolerance: '0.01',
          swap_adjustment_strategy: undefined,
          swap_amount: '1200000',
          target_denom: 'ukuji',
          target_receive_amount: undefined,
          target_start_time_utc_seconds: undefined,
          time_interval: {
            custom: {
              seconds: 86400,
            },
          },
        },
      });
    });

    it('should return correct message when DCA+ is set on v2', () => {
      const context: BuildCreateVaultContext = {
        initialDenom,
        resultingDenom,
        timeInterval: { increment: 1, interval: 'daily' },
        swapAmount: 1.2,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1.0,
        isDcaPlus: true,
        destinationConfig: {
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyId: undefined,
        },
      };

      const msg = buildCreateVaultMsg(
        mockChainConfig,
        { ...mockConfig, exchange_contract_address: undefined } as unknown as Config,
        context,
      );
      expect(msg).toEqual({
        create_vault: {
          destinations: undefined,
          label: '',
          minimum_receive_amount: undefined,
          performance_assessment_strategy: 'compare_to_standard_dca',
          slippage_tolerance: '0.01',
          swap_adjustment_strategy: {
            risk_weighted_average: {
              base_denom: 'bitcoin',
            },
          },
          swap_amount: '1200000',
          target_denom: 'ukuji',
          target_receive_amount: undefined,
          target_start_time_utc_seconds: undefined,
          time_interval: {
            custom: {
              seconds: 86400,
            },
          },
        },
      });
    });

    it('should return correct message when DCA+ is set', () => {
      const context: BuildCreateVaultContext = {
        initialDenom,
        resultingDenom,
        timeInterval: { increment: 1, interval: 'daily' },
        swapAmount: 1.2,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1.0,
        isDcaPlus: true,
        destinationConfig: {
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyId: undefined,
        },
      };

      const msg = buildCreateVaultMsg(mockChainConfig, mockConfig, context);
      expect(msg).toEqual({
        create_vault: {
          destinations: undefined,
          label: '',
          minimum_receive_amount: undefined,
          performance_assessment_strategy: 'compare_to_standard_dca',
          slippage_tolerance: '0.01',
          swap_adjustment_strategy: {
            risk_weighted_average: {
              base_denom: 'bitcoin',
              position_type: 'enter',
            },
          },
          swap_amount: '1200000',
          target_denom: 'ukuji',
          target_receive_amount: undefined,
          target_start_time_utc_seconds: undefined,
          time_interval: {
            custom: {
              seconds: 86400,
            },
          },
        },
      });
    });

    it('should return correct message when weighted scale is set', () => {
      const context: BuildCreateVaultContext = {
        initialDenom,
        resultingDenom,
        timeInterval: { increment: 1, interval: 'daily' },
        swapAmount: 1.2,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1.0,
        swapAdjustment: { basePrice: 1, swapMultiplier: 2, applyMultiplier: true },
        destinationConfig: {
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyId: undefined,
        },
      };

      const msg = buildCreateVaultMsg(mockChainConfig, mockConfig, context);
      expect(msg).toEqual({
        create_vault: {
          destinations: undefined,
          label: '',
          minimum_receive_amount: undefined,
          performance_assessment_strategy: undefined,
          slippage_tolerance: '0.01',
          swap_adjustment_strategy: {
            weighted_scale: {
              base_receive_amount: '1200000',
              increase_only: true,
              multiplier: '2',
            },
          },
          swap_amount: '1200000',
          target_denom: 'ukuji',
          target_receive_amount: undefined,
          target_start_time_utc_seconds: undefined,
          time_interval: {
            custom: {
              seconds: 86400,
            },
          },
        },
      });
    });

    it('should return correct message when time trigger is set', () => {
      const context: BuildCreateVaultContext = {
        initialDenom,
        resultingDenom,
        timeInterval: { increment: 1, interval: 'daily' },
        timeTrigger: { startDate: new Date('2022-01-02T00:00:00Z'), startTime: '11:11' },
        swapAmount: 1.2,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1.0,
        destinationConfig: {
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyId: undefined,
        },
      };

      const msg = buildCreateVaultMsg(mockChainConfig, mockConfig, context);
      expect(msg).toEqual({
        create_vault: {
          destinations: undefined,
          label: '',
          minimum_receive_amount: undefined,
          performance_assessment_strategy: undefined,
          slippage_tolerance: '0.01',
          swap_amount: '1200000',
          target_denom: 'ukuji',
          target_receive_amount: undefined,
          target_start_time_utc_seconds: '1641121860',
          time_interval: {
            custom: {
              seconds: 86400,
            },
          },
        },
      });
    });

    it('should return correct message when time trigger is set without start time', () => {
      const context: BuildCreateVaultContext = {
        initialDenom,
        resultingDenom,
        timeInterval: { increment: 1, interval: 'daily' },
        timeTrigger: { startDate: new Date('2022-01-02T00:00:00Z'), startTime: undefined },
        swapAmount: 1.2,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1.0,
        destinationConfig: {
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyId: undefined,
        },
      };

      const msg = buildCreateVaultMsg(mockChainConfig, mockConfig, context);
      expect(msg).toEqual({
        create_vault: {
          destinations: undefined,
          label: '',
          minimum_receive_amount: undefined,
          performance_assessment_strategy: undefined,
          slippage_tolerance: '0.01',
          swap_amount: '1200000',
          target_denom: 'ukuji',
          target_receive_amount: undefined,
          target_start_time_utc_seconds: '1641081600',
          time_interval: {
            custom: {
              seconds: 86400,
            },
          },
        },
      });
    });

    it('should throw error when DCA+ and weighted scale are both set', () => {
      const context: BuildCreateVaultContext = {
        initialDenom,
        resultingDenom,
        timeInterval: { increment: 1, interval: 'daily' },
        swapAmount: 1.2,
        transactionType: TransactionType.Buy,
        slippageTolerance: 1.0,
        isDcaPlus: true,
        swapAdjustment: { basePrice: 1, swapMultiplier: 2, applyMultiplier: true },
        destinationConfig: {
          senderAddress: 'kujira1',
          autoStakeValidator: undefined,
          autoCompoundStakingRewards: undefined,
          recipientAccount: undefined,
          yieldOption: undefined,
          reinvestStrategyId: undefined,
        },
      };

      expect(() => buildCreateVaultMsg(mockChainConfig, mockConfig, context)).toThrowError(
        'Swap adjustment is not supported for DCA+',
      );
    });
  });
});
