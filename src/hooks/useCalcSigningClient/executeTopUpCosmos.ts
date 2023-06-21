import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainContractAddress } from '@helpers/chains';
import { Strategy } from '@models/Strategy';
import { getStrategyInitialDenom } from '@helpers/strategy';
import { Chains } from '../useChain/Chains';

export function executeTopUpCosmos(
  address: string,
  client: SigningCosmWasmClient,
  chain: Chains,
  strategy: Strategy,
  topUpAmount: number,
) {
  if (strategy.owner !== address) {
    throw new Error('You are not the owner of this strategy');
  }
  const { deconversion, id } = getStrategyInitialDenom(strategy);

  const msg = {
    deposit: {
      vault_id: strategy.id,
      address,
    },
  } as ExecuteMsg;

  const funds = [{ denom: id, amount: BigInt(deconversion(topUpAmount)).toString() }];

  const result = client.execute(address, getChainContractAddress(chain), msg, 'auto', undefined, funds);
  return result;
}
