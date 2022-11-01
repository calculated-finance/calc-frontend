import { keyBy } from 'lodash'

export function getValidatorNameFromValidators(validators: {value: string, label: string}[], validatorAddress: string) {
  const validatorsByAddress = keyBy(validators, "value")
  return validatorsByAddress[validatorAddress]?.label ? validatorsByAddress[validatorAddress].label : validatorAddress
}
