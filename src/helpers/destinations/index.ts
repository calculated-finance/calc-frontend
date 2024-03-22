import { getDCAContractAddress, getRedBankAddress } from '@helpers/chains';
import { ChainId } from '@models/ChainId';
import { Strategy } from '@models/Strategy';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';

export function getStrategyPostSwapDetails(strategy: Strategy) {
  const { destinations } = strategy.rawData;
  const [destination] = destinations;
  const { msg } = destination;

  if (msg) {
    const decodedMsg = Buffer.from(msg, 'base64').toString('ascii');
    const parsedMsg = JSON.parse(decodedMsg);
    return parsedMsg;
  }
  return null;
}

export function getStrategyValidatorAddress(strategy: Strategy) {
  const postSwapDetails = getStrategyPostSwapDetails(strategy) || {};
  if (postSwapDetails?.z_delegate) {
    return postSwapDetails.z_delegate.validator_address;
  }

  if (postSwapDetails?.old_z_delegate) {
    return postSwapDetails.old_z_delegate.validator_address;
  }

  return undefined;
}

export function getStrategyPostSwapType(strategy: Strategy, chainId: ChainId) {
  const { destinations } = strategy.rawData;
  const [destination] = destinations;

  if (destination.address === getRedBankAddress(chainId)) {
    return PostPurchaseOptions.GenerateYield;
  }

  if (destination.address === getDCAContractAddress(chainId)) {
    if (getStrategyValidatorAddress(strategy)) {
      return PostPurchaseOptions.Stake;
    }
    return PostPurchaseOptions.Reinvest;
  }

  return PostPurchaseOptions.SendToWallet;
}

export function getStrategyPostSwapSendToAnotherWallet(
  strategy: Strategy,
  chain: ChainId,
  address: string | undefined,
) {
  const { destinations } = strategy.rawData;
  if (getStrategyPostSwapType(strategy, chain) === PostPurchaseOptions.SendToWallet) {
    const [destination] = destinations;
    if (destination.address !== address) {
      return destination.address;
    }
  }
  return undefined;
}

export function getStrategyReinvestStrategyId(strategy: Strategy) {
  const postSwapDetails = getStrategyPostSwapDetails(strategy);
  if (postSwapDetails && 'deposit' in postSwapDetails) {
    return postSwapDetails.deposit.vault_id;
  }
  return undefined;
}
