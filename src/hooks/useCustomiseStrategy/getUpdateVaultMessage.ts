import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { ConfigureVariables } from './ConfigureVariables';
import { buildTimeInterval } from './buildTimeInterval';
import { buildSlippageTolerance } from './buildSlippageTolerance';
import { buildSwapAdjustmentStrategy } from './buildSwapAdjustmentStrategy';
import { buildPriceThreshold } from './buildPriceThreshold';
import { buildSwapAmount } from './buildSwapAmount';

export function getUpdateVaultMessage(variables: ConfigureVariables) {
  const updateVaultMsg = {
    update_vault: {
      vault_id: variables.strategy.id,
      ...buildPriceThreshold(variables),
      ...buildSlippageTolerance(variables.values.slippageTolerance, variables.initialValues.slippageTolerance),
      ...buildTimeInterval(variables),
      ...buildSwapAdjustmentStrategy(variables),
      ...buildSwapAmount(variables),
    },
  } as ExecuteMsg;
  return updateVaultMsg;
}
