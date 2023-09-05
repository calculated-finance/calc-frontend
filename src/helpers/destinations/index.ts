import { getChainContractAddress, getMarsAddress } from '@helpers/chains';
import { Chains } from '@hooks/useChain/Chains';
import { Strategy } from '@models/Strategy';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import { LockableDuration } from 'src/interfaces/generated-osmosis/execute';

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

export function getStrategyPostSwapType(strategy: Strategy, chain: Chains) {
  const { destinations } = strategy.rawData;
  const [destination] = destinations;

  if (destination.address === getMarsAddress()) {
    return PostPurchaseOptions.GenerateYield;
  }

  if (destination.address === getChainContractAddress(chain)) {
    if (getStrategyValidatorAddress(strategy)) {
      return PostPurchaseOptions.Stake;
    }
    return PostPurchaseOptions.Reinvest;
  }

  return PostPurchaseOptions.SendToWallet;
}

export function getStrategyPostSwapSendToAnotherWallet(strategy: Strategy, chain: Chains, address: string | undefined) {
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

export function getStrategyProvideLiquidityConfig():
  | {
      duration: LockableDuration;
      pool_id: number;
    }
  | undefined {
  return undefined;
  // const { destinations } = strategy.rawData;

  // const provideLiquidityDestination = destinations?.find((destination: Destination) => {
  //   if (typeof destination.action === 'object' && 'z_provide_liquidity' in destination.action) {
  //     return true;
  //   }
  //   return false;
  // });
  // if (
  //   provideLiquidityDestination &&
  //   typeof provideLiquidityDestination.action === 'object' &&
  //   'z_provide_liquidity' in provideLiquidityDestination.action
  // ) {
  //   return provideLiquidityDestination?.action.z_provide_liquidity;
  // }
  // return undefined;
}
