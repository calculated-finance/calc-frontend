import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { Chains, useChain } from './useChain';
import { useKujira } from './useKujira';
import { useOsmosis } from './useOsmosis';
import useQueryWithNotification from './useQueryWithNotification';

const useValidators = () => {
  const kujiraQuery = useKujira((state) => state.query);

  const osmosisQuery = useOsmosis((state) => state.query);

  const { chain } = useChain();

  const { data, ...other } = useQueryWithNotification<{ validators: Validator[] }>(
    ['validators', chain],
    () => {
      if (chain === Chains.Osmosis) {
        return osmosisQuery?.cosmos.staking.v1beta1.validators({ status: 'BOND_STATUS_BONDED' });
      }
      return kujiraQuery?.staking.validators('BOND_STATUS_BONDED');
    },
    {
      enabled: !!kujiraQuery && !!osmosisQuery && !!chain,
    },
  );

  return {
    validators: data?.validators.filter((validator) => !validator.jailed),
    ...other,
  };
};

export default useValidators;
