/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';
import * as Sentry from '@sentry/react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { isNil } from 'lodash';
import { getChainContractAddress } from '@helpers/chains';
import { EncodeObject } from '@cosmjs/proto-signing';
import { useChain } from '../useChain';
import { getExecuteMsg } from '../useCreateVault/getCreateVaultExecuteMsg';
import { STRATEGY_KEY } from '../useStrategy';
import { useAnalytics } from '../useAnalytics';
import { ConfigureVariables } from './ConfigureVariables';
import { getUpdateVaultMessage } from './getUpdateVaultMessage';

export function useCustomiseStrategy() {
  const { address, signingClient: client } = useWallet();

  const { track } = useAnalytics();

  const { chain } = useChain();

  const queryClient = useQueryClient();
  return useMutation<DeliverTxResponse, Error, ConfigureVariables>(
    (variables) => {
      if (isNil(address)) {
        throw new Error('address is null or empty');
      }
      if (!client) {
        throw new Error('client is null or empty');
      }

      if (isNil(chain)) {
        throw new Error('chain is null or empty');
      }

      if (variables.strategy.owner !== address) {
        throw new Error('You are not the owner of this strategy');
      }

      const msgs: EncodeObject[] = [];

      const updateVaultMsg = getUpdateVaultMessage(variables);
      msgs.push(getExecuteMsg(updateVaultMsg, undefined, address, getChainContractAddress(chain)));

      return client.signAndBroadcast(address, msgs, 'auto');
    },
    {
      onSuccess: (data, variables) => {
        track('Strategy Customisation Updated', { msg: getUpdateVaultMessage(variables) });
        queryClient.invalidateQueries({ queryKey: [STRATEGY_KEY, variables.strategy.id] });
      },
      onError: (error, { values }) => {
        Sentry.captureException(error, { tags: { chain, values: JSON.stringify(values) } });
      },
    },
  );
}
