import { StrategyOsmosis } from '@hooks/useStrategies';
import { DcaInFormDataPostPurchase } from '@models/DcaInFormData';
import { Chains } from '@hooks/useChain';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import SendToWalletValues from '@models/SendToWalletValues';
import {
  getStrategyPostSwapType,
  getStrategyReinvestStrategyId,
  getStrategyValidatorAddress,
} from '@helpers/destinations';

export function getExistingValues(
  strategy: StrategyOsmosis,
  chain: Chains,
  address: string,
): Partial<DcaInFormDataPostPurchase> {
  const postPurchaseOption = getStrategyPostSwapType(strategy, chain);
  const { destinations } = strategy;
  const [destination] = destinations;

  if (postPurchaseOption === PostPurchaseOptions.SendToWallet) {
    if (destination?.address !== address) {
      return {
        postPurchaseOption,
        sendToWallet: SendToWalletValues.No,
        recipientAccount: destination?.address,
      };
    }
    return {
      postPurchaseOption,
      sendToWallet: SendToWalletValues.Yes,
    };
  }

  if (postPurchaseOption === PostPurchaseOptions.Stake) {
    return {
      postPurchaseOption,
      autoStakeValidator: getStrategyValidatorAddress(strategy, chain),
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
