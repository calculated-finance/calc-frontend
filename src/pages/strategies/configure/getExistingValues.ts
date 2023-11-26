import { DcaInFormDataPostPurchase } from '@models/DcaInFormData';
import { ChainId } from '@hooks/useChainId/Chains';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import {
  getStrategyPostSwapType,
  getStrategyReinvestStrategyId,
  getStrategyValidatorAddress,
} from '@helpers/destinations';
import YesNoValues from '@models/YesNoValues';
import { Strategy } from '@models/Strategy';

export function getExistingValues(
  strategy: Strategy,
  chain: ChainId,
  address: string,
): Partial<DcaInFormDataPostPurchase> {
  const postPurchaseOption = getStrategyPostSwapType(strategy, chain);
  const { destinations } = strategy.rawData;
  const [destination] = destinations;

  if (postPurchaseOption === PostPurchaseOptions.SendToWallet) {
    if (destination?.address !== address) {
      return {
        postPurchaseOption,
        sendToWallet: YesNoValues.No,
        recipientAccount: destination?.address,
      };
    }
    return {
      postPurchaseOption,
      sendToWallet: YesNoValues.Yes,
    };
  }

  if (postPurchaseOption === PostPurchaseOptions.Stake) {
    return {
      postPurchaseOption,
      autoStakeValidator: getStrategyValidatorAddress(strategy),
    };
  }

  if (postPurchaseOption === PostPurchaseOptions.Reinvest) {
    return {
      postPurchaseOption,
      reinvestStrategy: getStrategyReinvestStrategyId(strategy),
    };
  }

  if (postPurchaseOption === PostPurchaseOptions.GenerateYield) {
    return {
      postPurchaseOption,
      yieldOption: 'mars',
    };
  }

  return {};
}
