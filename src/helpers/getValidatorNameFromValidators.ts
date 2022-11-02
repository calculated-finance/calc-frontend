import { keyBy } from 'lodash'
import { Validator } from '../hooks/useValidators'

export function getValidatorNameFromValidators(validators: Validator[], validatorAddress: string) {
  const validatorsByAddress = keyBy(validators, "operator_address")
  return validatorsByAddress[validatorAddress]?.description?.moniker ? 
  validatorsByAddress[validatorAddress].description?.moniker : validatorAddress
}
