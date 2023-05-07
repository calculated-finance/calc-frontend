import { getChainContractAddress, getMarsAddress } from '@helpers/chains';
import { Chains } from '@hooks/useChain';
import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import { Destination, LockableDuration } from 'src/interfaces/generated-osmosis/execute';

export function buildCallbackDestinations(
  chain: Chains,
  autoStakeValidator: string | null | undefined,
  recipientAccount: string | null | undefined,
  yieldOption: string | null | undefined,
  senderAddress: string,
  reinvestStrategy: string | null | undefined,
) {
  const destinations = [] as Destination[];

  if (autoStakeValidator) {
    destinations.push({
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
    });
  }

  if (recipientAccount) {
    destinations.push({ address: recipientAccount, allocation: '1.0', msg: null });
  }

  if (reinvestStrategy) {
    const msg = {
      deposit: {
        vault_id: reinvestStrategy,
        address: senderAddress,
      },
    };
    destinations.push({
      address: getChainContractAddress(chain),
      allocation: '1.0',
      msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
    });
  }
  if (yieldOption) {
    if (yieldOption === 'mars') {
      const msg = {
        deposit: {
          on_behalf_of: senderAddress,
        },
      };
      destinations.push({
        address: getMarsAddress(),
        allocation: '1.0',
        msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
      });
    }
  }

  return destinations.length ? destinations : undefined;
}

export function getStrategyPostSwapDetails(strategy: StrategyOsmosis) {
  const { destinations } = strategy;
  const [destination] = destinations;
  const { msg } = destination;

  console.log('msg', msg);
  if (msg) {
    // decode base64
    const decodedMsg = Buffer.from(msg, 'base64').toString('ascii');
    // parse json
    const parsedMsg = JSON.parse(decodedMsg);
    return parsedMsg;
  }
  return null;
}

export function getStrategyValidatorAddress(strategy: StrategyOsmosis) {
  const { z_delegate } = getStrategyPostSwapDetails(strategy) || {};
  if (z_delegate) {
    return z_delegate.validator_address;
  }
  return undefined;
}

export function getStrategyPostSwapType(strategy: StrategyOsmosis | Strategy, chain: Chains) {
  const { destinations } = strategy;
  const [destination] = destinations;

  if (chain === Chains.Kujira) {
    if (destination.address === getChainContractAddress(chain)) {
      return PostPurchaseOptions.Stake;
    }
    return PostPurchaseOptions.SendToWallet;
  }

  const castedStrategy = strategy as StrategyOsmosis;

  if (destination.address === getMarsAddress()) {
    return PostPurchaseOptions.GenerateYield;
  }

  if (destination.address === getChainContractAddress(chain)) {
    if (getStrategyValidatorAddress(castedStrategy)) {
      return PostPurchaseOptions.Stake;
    }
    return PostPurchaseOptions.Reinvest;
  }

  return PostPurchaseOptions.SendToWallet;
}

export function getStrategyPostSwapSendToAnotherWallet(
  strategy: StrategyOsmosis,
  chain: Chains,
  address: string | undefined,
) {
  const { destinations } = strategy;
  if (getStrategyPostSwapType(strategy, chain) === PostPurchaseOptions.SendToWallet) {
    const [destination] = destinations;
    if (destination.address !== address) {
      return destination.address;
    }
  }
  return undefined;
}

export function getStrategyReinvestStrategyId(strategy: StrategyOsmosis) {
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
  // const { destinations } = strategy;

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

export function getPostSwapCallback(strategy: Strategy | StrategyOsmosis, chain: Chains) {
  if (chain === Chains.Kujira) {
    if (strategy.destinations.length && (strategy as Strategy).destinations[0].action === 'z_delegate') {
      return {
        validatorAddress: strategy.destinations.length && strategy.destinations[0].address,
      };
    }
    return {
      validatorAddress: null,
    };
  }
  if (strategy.destinations.length) {
    const [destination] = (strategy as StrategyOsmosis).destinations;
    const { msg } = destination;
    if (msg) {
      const decoded = Buffer.from(msg, 'base64').toString('ascii');
      if (decoded) {
        const parsed = JSON.parse(decoded);
        return {
          validatorAddress: parsed?.z_delegate?.validator_address,
        };
      }
    }
  }
  return {
    validatorAddress: null,
  };
}
