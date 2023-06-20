/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';
import * as Sentry from '@sentry/react';
import { useMutation } from '@tanstack/react-query';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { DenomInfo } from '@utils/DenomInfo';
import { isNil } from 'lodash';
import { getStrategyInitialDenom } from '@helpers/strategy';
import { Strategy } from '@models/Strategy';
import { useChain } from '../useChain';
import { Chains } from '../useChain/Chains';
import { useMetamask } from '../useMetamask';
import { executeTopUpCosmos } from './executeTopUpCosmos';
import { executeTopUpEVM } from './executeTopUpEVM';

type TopUpVariables = {
  values: {
    topUpAmount: number;
  };
  strategy: Strategy;
};

const useTopUpStrategy = () => {
  const { address, signingClient: client } = useWallet();

  const provider = useMetamask((metaMaskState) => metaMaskState.provider);
  const signer = useMetamask((metaMaskState) => metaMaskState.signer);

  const { chain } = useChain();

  return useMutation<ExecuteResult, Error, TopUpVariables>(
    ({ values, strategy }) => {
      if (strategy.owner !== address) {
        throw new Error('You are not the owner of this strategy');
      }

      if (isNil(chain)) {
        throw new Error('chain is null or empty');
      }

      if (isNil(address)) {
        throw new Error('address is null or empty');
      }

      const { topUpAmount } = values;
      const initialDenom = getStrategyInitialDenom(strategy);

      if (chain === Chains.Moonbeam) {
        if (!provider || !signer) {
          throw new Error('provider or signer is null or empty');
        }
        return executeTopUpEVM(initialDenom, address, provider, signer, chain, strategy.id, topUpAmount);
      }

      if (!client) {
        throw new Error('client is null or empty');
      }

      return executeTopUpCosmos(initialDenom, address, client, chain, strategy.id, topUpAmount);
    },
    {
      onError: (error, { values }) => {
        Sentry.captureException(error, { tags: { chain, values: JSON.stringify(values) } });
      },
    },
  );
};
export default useTopUpStrategy;
