/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';
import * as Sentry from '@sentry/react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExecuteMsg } from 'src/interfaces/generated-osmosis/execute';
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { isNil } from 'lodash';
import { getChainContractAddress } from '@helpers/chains';
import { EncodeObject } from '@cosmjs/proto-signing';
import { CustomiseSchemaDca } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { useChain } from './useChain';
import { Strategy } from './useStrategies';
import { getExecuteMsg } from './useCreateVault/getCreateVaultExecuteMsg';
import { STRATEGY_KEY } from './useStrategy';

type ConfigureVariables = {
  values: CustomiseSchemaDca;
  strategy: Strategy;
};

export function useCustomiseStrategy() {
  const { address, signingClient: client } = useWallet();

  const { chain } = useChain();

  const queryClient = useQueryClient();
  return useMutation<DeliverTxResponse, Error, ConfigureVariables>(
    ({ values, strategy }) => {
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

      const msgs: EncodeObject[] = [];

      const updateVaultMsg = {
        update_vault: {},
      } as ExecuteMsg;

      msgs.push(getExecuteMsg(updateVaultMsg, undefined, address, getChainContractAddress(chain)));

      return client.signAndBroadcast(address, msgs, 'auto');
    },
    {
      onSuccess: (data, { strategy }) => {
        queryClient.invalidateQueries({ queryKey: [STRATEGY_KEY, strategy.id] });
      },
      onError: (error, { values }) => {
        Sentry.captureException(error, { tags: { chain, values: JSON.stringify(values) } });
      },
    },
  );
}
