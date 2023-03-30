/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@hooks/useWallet';
import { CONTRACT_ADDRESS } from 'src/constants';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { ExecuteMsg } from 'src/interfaces/generated/execute';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { Denom } from '@models/Denom';
import { isNil } from 'lodash';
import { Strategy } from './useStrategies';

type TopUpVariables = {
  values: {
    topUpAmount: number;
  };
  initialDenom: Denom;
  id: Strategy['id'];
};

const useTopUpStrategy = () => {
  const { address, signingClient: client } = useWallet();

  return useMutation<ExecuteResult, Error, TopUpVariables>(({ values, initialDenom, id }) => {
    const { deconversion } = getDenomInfo(initialDenom);

    if (isNil(address)) {
      throw new Error('address is null or empty');
    }
    if (!client) {
      throw new Error('client is null or empty');
    }
    const msg = {
      deposit: {
        vault_id: id,
        address,
      },
    } as ExecuteMsg;

    const funds = [{ denom: initialDenom, amount: deconversion(values.topUpAmount).toString() }];

    const result = client.execute(address, CONTRACT_ADDRESS, msg, 'auto', undefined, funds);
    return result;
  });
};
export default useTopUpStrategy;
