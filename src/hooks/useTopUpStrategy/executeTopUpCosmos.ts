import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainContractAddress } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { Chains } from '../useChain/Chains';

export function executeTopUpCosmos(
  initialDenom: DenomInfo,
  address: string,
  client: SigningCosmWasmClient,
  chain: Chains,
  strategyId: string,
  topUpAmount: number,
) {
  const { deconversion } = initialDenom;

  const msg = {
    deposit: {
      vault_id: strategyId,
      address,
    },
  } as ExecuteMsg;

  const funds = [{ denom: initialDenom.id, amount: BigInt(deconversion(topUpAmount)).toString() }];

  const result = client.execute(address, getChainContractAddress(chain), msg, 'auto', undefined, funds);
  return result;
}
