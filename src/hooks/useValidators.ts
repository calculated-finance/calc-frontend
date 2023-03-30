import { useKujira } from './useKujira';
import useQueryWithNotification from './useQueryWithNotification';

const useValidators = () => {
  const query = useKujira((state) => state.query);

  const { data, ...other } = useQueryWithNotification(
    ['validators'],
    () => query?.staking.validators('BOND_STATUS_BONDED'),
    {
      enabled: !!query,
    },
  );

  return {
    validators: data?.validators.filter((validator) => !validator.jailed),
    ...other,
  };
};

export default useValidators;
