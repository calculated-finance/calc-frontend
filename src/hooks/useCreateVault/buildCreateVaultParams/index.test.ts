import { TransactionType } from '@components/TransactionType';
import { DenomInfo } from '@utils/DenomInfo';
import { defaultDenom } from '@utils/getDenomInfo';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import {
  getExecutionInterval,
  getMinimumReceiveAmount,
  getOsmosisReceiveAmount,
  getReceiveAmount,
  getSlippageWithoutTrailingZeros,
} from '.';

describe('build params', () => {
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
    it('returns undefined when price is null', () => {
      expect(getReceiveAmount(null, (value) => value * 1000, 100, TransactionType.Buy, 2)).toBeUndefined();
    });

    it('returns undefined when price is undefined', () => {
      expect(getReceiveAmount(undefined, (value) => value * 1000, 100, TransactionType.Buy, 2)).toBeUndefined();
    });

    it('returns the correct receive amount when transaction type is "Buy"', () => {
      expect(getReceiveAmount(10, (value) => value * 1000, 100, TransactionType.Buy, 2)).toBe('10000');
      expect(getReceiveAmount(10, (value) => value * 100000, 100, TransactionType.Buy, 3)).toBe('1000000');
      expect(getReceiveAmount(10, (value) => value * 1000000, 100, TransactionType.Buy, 4)).toBe('10000000');
    });

    it('returns the correct receive amount when transaction type is "Sell"', () => {
      expect(getReceiveAmount(10, (value) => value * 1000, 100, TransactionType.Sell, 2)).toBe('1000000');
      expect(getReceiveAmount(10, (value) => value * 1000, 100, TransactionType.Sell, 3)).toBe('1000000');
      expect(getReceiveAmount(10, (value) => value * 1000, 100, TransactionType.Sell, 4)).toBe('1000000');
    });
  });

  describe('getOsmosisReceiveAmount', () => {
    it('returns undefined if price is null', () => {
      const result = getOsmosisReceiveAmount(undefined, 1.2, null, undefined, TransactionType.Buy);
      expect(result).toBeUndefined();
    });

    it('returns undefined if price is undefined', () => {
      const result = getOsmosisReceiveAmount(undefined, 1.2, undefined, undefined, TransactionType.Buy);
      expect(result).toBeUndefined();
    });

    it('throws an error if initialDenom is missing properties', () => {
      expect(() =>
        getOsmosisReceiveAmount(
          undefined,
          1.2,
          5,
          { ...defaultDenom, id: '', significantFigures: 18 },
          TransactionType.Buy,
        ),
      ).toThrowError('Missing denom info');
    });

    it('throws an error if resultingDenom is missing properties', () => {
      expect(() =>
        getOsmosisReceiveAmount(
          { ...defaultDenom, id: '', deconversion: (amount) => amount, significantFigures: 6 },
          1.2,
          5,
          undefined,
          TransactionType.Buy,
        ),
      ).toThrowError('Missing denom info');
    });

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
      const result = getOsmosisReceiveAmount(initialDenom, 1.2, 5.0, resultingDenom, TransactionType.Buy);
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
      const result = getOsmosisReceiveAmount(initialDenom, 1.2, 5.0, resultingDenom, TransactionType.Sell);
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
      const result = getOsmosisReceiveAmount(initialDenom, 1.2, 5.0, resultingDenom, TransactionType.Buy);
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

    it('should return the execution interval when executionIntervalIncrement is null, undefined or 0 or less', () => {
      const testCases = [
        { interval: 'minute' as ExecutionIntervals, increment: null },
        { interval: 'half_hourly' as ExecutionIntervals, increment: undefined },
        { interval: 'hourly' as ExecutionIntervals, increment: 0 },
        { interval: 'daily' as ExecutionIntervals, increment: -1 },
      ];

      testCases.forEach(({ interval, increment }) => {
        const result = getExecutionInterval(interval, increment);
        expect(result).toEqual(interval);
      });
    });
  });
});
