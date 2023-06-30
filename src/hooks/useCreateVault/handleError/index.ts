import * as Sentry from '@sentry/react';
import { BuildCreateVaultContext } from '../buildCreateVaultParams';

function getSentryCreateVaultTags(createVaultContext: BuildCreateVaultContext) {
  return {
    ...createVaultContext,
    initialDenom: createVaultContext.initialDenom.name,
    resultingDenom: createVaultContext.resultingDenom.name,
    timeInterval: `${createVaultContext.timeInterval.increment} ${createVaultContext.timeInterval.interval}`,
    timeTrigger: `${createVaultContext.timeTrigger?.startDate} ${createVaultContext.timeTrigger?.startTime}`,
    destinationConfig: JSON.stringify(createVaultContext.destinationConfig),
    swapAdjustment: JSON.stringify(createVaultContext.swapAdjustment),
  };
}

export function handleError(createVaultContext: BuildCreateVaultContext): (reason: any) => PromiseLike<never> {
  return (error) => {
    if (error instanceof Error) {
      if (!error.message.includes('Request rejected')) {
        Sentry.captureException(error, {
          tags: getSentryCreateVaultTags(createVaultContext),
        });
        throw new Error(error.message);
      }
      throw new Error('Transaction cancelled');
    }
    throw new Error('Unknown error');
  };
}
