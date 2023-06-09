import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { Chains } from '../useChain/Chains';
import { ConfigureVariables } from './ConfigureVariables';
import { buildTimeInterval } from './buildTimeInterval';
import { buildSlippageTolerance } from './buildSlippageTolerance';
import { buildSwapAdjustmentStrategy } from './buildSwapAdjustmentStrategy';
import { buildPriceThreshold } from './buildPriceThreshold';

export function getUpdateVaultMessage(variables: ConfigureVariables, chain: Chains) {
  const updateVaultMsg = {
    update_vault: {
      vault_id: variables.strategy.id,
      ...buildPriceThreshold(variables, chain),
      ...buildSlippageTolerance(variables.values.slippageTolerance, variables.initialValues.slippageTolerance),
      ...buildTimeInterval(variables),
      ...buildSwapAdjustmentStrategy(variables),
    },
  } as ExecuteMsg;
  return updateVaultMsg;
}
