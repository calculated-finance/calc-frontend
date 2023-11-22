import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from './useChainId';
import { useChainClient } from './useChainClient';

const useValidators = () => {
  const { chainId: chain } = useChainId();
  const chainClient = useChainClient(chain);

  const { data, ...other } = useQuery<{ validators: Validator[] }>(
    ['validators', chain],
    () => chainClient!.fetchValidators() ?? { validators: [] },
    {
      enabled: !!chain && !!chainClient,
      meta: {
        errorMessage: 'Error fetching validators',
      },
    },
  );

  return {
    validators: data?.validators.filter((validator) => !validator.jailed),
    ...other,
  };
};

export default useValidators;
