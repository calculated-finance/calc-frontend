/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';
import * as Sentry from '@sentry/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeliverTxResponse, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { isNil } from 'lodash';
import { getChainContractAddress } from '@helpers/chains';
import { EncodeObject } from '@cosmjs/proto-signing';
import { useChainId } from '@hooks/useChainId';
import { getExecuteMsg } from '@hooks/useCreateVault/getCreateVaultExecuteMsg';
import { STRATEGY_KEY } from '@hooks/useStrategy';
import { useAnalytics } from '@hooks/useAnalytics';
import { ConfigureVariables } from './ConfigureVariables';
import { getUpdateVaultMessage } from './getUpdateVaultMessage';

export function useCustomiseStrategy() {
  const { address, getSigningClient, connected } = useWallet();
  const { track } = useAnalytics();
  const { chainId } = useChainId();
  const queryClient = useQueryClient();

  const { data: signingClient } = useQuery<SigningCosmWasmClient>(
    ['signingCosmWasmClient', chainId],
    getSigningClient,
    {
      enabled: connected,
      staleTime: 1000 * 60 * 10,
    },
  );

  return useMutation<DeliverTxResponse, Error, ConfigureVariables>(
    (variables) => {
      if (isNil(address)) {
        throw new Error('address is null or empty');
      }

      if (!signingClient) {
        throw new Error('client is null or empty');
      }

      if (isNil(chainId)) {
        throw new Error('chain is null or empty');
      }

      if (variables.strategy.owner !== address) {
        throw new Error('You are not the owner of this strategy');
      }

      const msgs: EncodeObject[] = [];

      const updateVaultMsg = getUpdateVaultMessage(variables);
      msgs.push(getExecuteMsg(updateVaultMsg, undefined, address, getChainContractAddress(chainId)));

      return signingClient.signAndBroadcast(address, msgs, 'auto');
    },
    {
      onSuccess: (_, variables) => {
        track('Strategy Customisation Updated', { msg: getUpdateVaultMessage(variables) });
        queryClient.invalidateQueries({ queryKey: [STRATEGY_KEY, variables.strategy.id] });
      },
      onError: (error, { values }) => {
        Sentry.captureException(error, { tags: { chain: chainId, values: JSON.stringify(values) } });
      },
    },
  );
}
