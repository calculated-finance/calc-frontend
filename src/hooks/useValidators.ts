import { REST_ENDPOINT } from 'src/constants';
import useQueryWithNotification from './useQueryWithNotification';

export type Validator = {
  operator_address: string;
  description: {
    moniker: string;
  };
  jailed: boolean;
};

export type ValidatorsResponse = {
  pagination: {
    next_key: string;
    total: string;
  };
  validators: Validator[];
};

const useValidators = (): Validator[] | undefined => {
  const pageSize = 1000;

  const { data } = useQueryWithNotification<ValidatorsResponse>(
    ['validators'],
    async () => {
      const response = await fetch(`${REST_ENDPOINT}/cosmos/staking/v1beta1/validators?pagination.limit=${pageSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    {
      keepPreviousData: true,
    },
  );

  return data?.validators.filter((v) => !v.jailed);
};

export default useValidators;
