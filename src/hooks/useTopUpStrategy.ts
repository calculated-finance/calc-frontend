/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { ExecuteMsg } from 'src/interfaces/generated/execute';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';

const useTopUpStrategy = () => {
  const { address, signingClient: client } = useWallet();

  return useMutation<ExecuteResult, Error, any, any>(({ values, initialDenom, id }) => {
    const { deconversion } = getDenomInfo(initialDenom);
    const msg = {
      deposit: {
        vault_id: id,
        address,
      },
    } as ExecuteMsg;

    const funds = [{ denom: initialDenom, amount: deconversion(values.topUpAmount).toString() }];

    const result = client!.execute(address, CONTRACT_ADDRESS, msg, 'auto', undefined, funds);
    return result;
  });
};
export default useTopUpStrategy;
