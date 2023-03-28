import { useNetwork } from './useNetwork';
import useQueryWithNotification from './useQueryWithNotification';

const useValidators = () => {
  const [{ query }] = useNetwork();
  const pageSize = 1000;

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
