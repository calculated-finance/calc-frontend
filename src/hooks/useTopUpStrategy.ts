/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';
import * as Sentry from '@sentry/react';
import { useMutation } from '@tanstack/react-query';
import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { isNil } from 'lodash';
import { getChainContractAddress } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { Strategy } from './useStrategies';
import { useChain } from './useChain';

type TopUpVariables = {
  values: {
    topUpAmount: number;
  };
  initialDenom: DenomInfo;
  strategy: Strategy;
};

const useTopUpStrategy = () => {
  const { address, signingClient: client } = useWallet();

  const { chain } = useChain();

  return useMutation<ExecuteResult, Error, TopUpVariables>(
    ({ values, initialDenom, strategy }) => {
      const { deconversion } = initialDenom;

      if (isNil(address)) {
        throw new Error('address is null or empty');
      }
      if (!client) {
        throw new Error('client is null or empty');
      }

      if (isNil(chain)) {
        throw new Error('chain is null or empty');
      }

      if (strategy.owner !== address) {
        throw new Error('You are not the owner of this strategy');
      }

      const msg = {
        deposit: {
          vault_id: strategy.id,
          address,
        },
      } as ExecuteMsg;

      const funds = [{ denom: initialDenom.id, amount: deconversion(values.topUpAmount).toString() }];

      const result = client.execute(address, getChainContractAddress(chain!), msg, 'auto', undefined, funds);
      return result;
    },
    {
      onError: (error, { values }) => {
        Sentry.captureException(error, { tags: { chain, values: JSON.stringify(values) } });
      },
    },
  );
};
export default useTopUpStrategy;
