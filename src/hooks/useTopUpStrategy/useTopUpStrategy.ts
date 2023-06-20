import { useWallet } from '@hooks/useWallet';
import * as Sentry from '@sentry/react';
import { useMutation } from '@tanstack/react-query';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { isNil } from 'lodash';
import { Strategy } from '@models/Strategy';
import { useCalcClient } from '@hooks/useCalcClient';
import { useChain } from '../useChain';

type TopUpVariables = {
  values: {
    topUpAmount: number;
  };
  strategy: Strategy;
};

const useTopUpStrategy = () => {
  const { chain } = useChain();
  const client = useCalcClient(chain);
  const { address } = useWallet();

  return useMutation<ExecuteResult, Error, TopUpVariables>(
    ({ values, strategy }) => {
      if (isNil(address)) {
        throw new Error('address is null or empty');
      }

      if (!client) {
        throw new Error('client is null or empty');
      }

      return client.topUpStrategy(address, strategy, values.topUpAmount);
    },
    {
      onError: (error, { values }) => {
        Sentry.captureException(error, { tags: { chain, values: JSON.stringify(values) } });
      },
    },
  );
};
export default useTopUpStrategy;
