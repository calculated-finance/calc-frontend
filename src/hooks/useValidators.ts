import { useQuery } from '@tanstack/react-query';
import { REST_ENDPOINT } from 'src/constants';

type Response = {
  validators: {
    value: string,
    label: string
  }[]
}

const useValidators = (): Response => {

  const { data } = useQuery(
    ['validators'],
    async () => {
      const response = await fetch(`${REST_ENDPOINT}/cosmos/staking/v1beta1/validators`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    {
      keepPreviousData: true,
    },
  );

  const validators = data?.validators
    ?.filter((v: any) => v.jailed === false)
    .map(
      (validator: any) =>
        ({
          value: validator.operator_address,
          label: validator.description.moniker,
        }),
    );

  return {
    validators
  };
};

export default useValidators;
