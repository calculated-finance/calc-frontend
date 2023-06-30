import * as Sentry from '@sentry/react';
import { defaultDenom } from '@utils/defaultDenom';
import { TestnetDenoms } from '@models/Denom';
import { TransactionType } from '@components/TransactionType';
import { handleError } from '.'; // adjust this import according to your project structure
import { BuildCreateVaultContext } from '../buildCreateVaultParams';

jest.mock('@sentry/react');

describe('handleError function', () => {
  const mockCreateVaultContext: BuildCreateVaultContext = {
    initialDenom: { ...defaultDenom, id: 'ukuji' },
    resultingDenom: { ...defaultDenom, id: TestnetDenoms.Demo },
    timeInterval: {
      increment: 1,
      interval: 'daily',
    },
    swapAmount: 10,
    transactionType: TransactionType.Buy,
    slippageTolerance: 1,
    destinationConfig: {
      senderAddress: 'kujira1',
      autoStakeValidator: 'autostakevalidator',
      autoCompoundStakingRewards: undefined,
      recipientAccount: undefined,
      yieldOption: undefined,
      reinvestStrategyId: undefined,
    },
  };
  const error = new Error('Test error');
  const requestRejectedError = new Error('Request rejected');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should capture an exception that is not "Request rejected"', async () => {
    const errorCallback = handleError(mockCreateVaultContext);

    try {
      errorCallback(error);
    } catch (e) {
      expect((e as Error).message).toBe('Test error');
    }

    const tags = {
      destinationConfig: JSON.stringify({ senderAddress: 'kujira1', autoStakeValidator: 'autostakevalidator' }),
      initialDenom: '',
      resultingDenom: '',
      slippageTolerance: 1,
      swapAdjustment: undefined,
      swapAmount: 10,
      timeInterval: '1 daily',
      timeTrigger: 'undefined undefined',
      transactionType: 'buy',
    };
    expect(Sentry.captureException).toHaveBeenCalledWith(error, { tags });
  });

  it('should throw "Transaction cancelled" for "Request rejected" errors', async () => {
    const errorCallback = handleError(mockCreateVaultContext);

    try {
      errorCallback(requestRejectedError);
    } catch (e) {
      expect((e as Error).message).toBe('Transaction cancelled');
    }
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('should throw "Unknown error" for non-instance of Error', async () => {
    const errorCallback = handleError(mockCreateVaultContext);

    try {
      errorCallback('some error');
    } catch (e) {
      expect((e as Error).message).toBe('Unknown error');
    }

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});
