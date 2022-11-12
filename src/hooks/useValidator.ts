import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import useValidators from './useValidators';

const useValidator = (validatorAddress: Validator['operatorAddress'] | null | undefined) => {
  const { validators, ...other } = useValidators();
  return {
    validator: validators?.find((validator) => validator.operatorAddress === validatorAddress),
    ...other,
  };
};

export default useValidator;
