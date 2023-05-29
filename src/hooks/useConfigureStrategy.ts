/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExecuteMsg } from 'src/interfaces/generated-osmosis/execute';
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { isNil } from 'lodash';
import { getChainContractAddress } from '@helpers/chains';
import { DcaInFormDataPostPurchase } from '@models/DcaInFormData';
import { buildCallbackDestinations } from '@helpers/destinations';
import { EncodeObject } from '@cosmjs/proto-signing';
import { useChain } from './useChain';
import { Strategy } from './useStrategies';
import { getGrantMsg } from './useCreateVault/getGrantMsg';
import { getExecuteMsg } from './useCreateVault/getCreateVaultExecuteMsg';
import { STRATEGY_KEY } from './useStrategy';

type ConfigureVariables = {
  values: DcaInFormDataPostPurchase;
  strategy: Strategy;
};

export function useConfigureStrategy() {
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

      const { autoStakeValidator } = values;

      if (autoStakeValidator) {
        msgs.push(getGrantMsg(address, chain));
      }

      const updateVaultMsg = {
        update_vault: {
          destinations:
            buildCallbackDestinations(
              chain,
              values.autoStakeValidator,
              values.recipientAccount,
              values.yieldOption,
              address,
              values.reinvestStrategy,
            ) || [],
          vault_id: strategy.id,
        },
      } as ExecuteMsg;

      msgs.push(getExecuteMsg(updateVaultMsg, undefined, address, getChainContractAddress(chain)));

      return client.signAndBroadcast(address, msgs, 'auto');
    },
    {
      onSuccess: (data, { strategy }) => {
        queryClient.invalidateQueries({ queryKey: [STRATEGY_KEY, strategy.id] });
      },
    },
  );
}
