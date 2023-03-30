import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { keyBy } from 'lodash';

export function getValidatorNameFromValidators(validators: Validator[], validatorAddress: string) {
  const validatorsByAddress = keyBy(validators, 'operator_address') as Record<string, Validator>;
  const validator = validatorsByAddress[validatorAddress];

  return validator?.description?.moniker || validatorAddress;
}
