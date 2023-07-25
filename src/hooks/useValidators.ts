import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';
import { useKujira } from './useKujira';
import { useOsmosis } from './useOsmosis';

const useValidators = () => {
  const kujiraQuery = useKujira((state) => state.query);

  const osmosisQuery = useOsmosis((state) => state.query);

  const { chain } = useChain();

  const { data, ...other } = useQuery<{ validators: Validator[] }>(
    ['validators', chain],
    () => {
      if (chain === Chains.Osmosis) {
        return osmosisQuery?.cosmos.staking.v1beta1.validators({ status: 'BOND_STATUS_BONDED' });
      }
      return kujiraQuery?.staking.validators('BOND_STATUS_BONDED');
    },
    {
      enabled: !!kujiraQuery && !!osmosisQuery && !!chain,
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
