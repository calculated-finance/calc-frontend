/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

import { useMutation } from '@tanstack/react-query';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import getDenomInfo from '@utils/getDenomInfo';

const useTopUpStrategy = () => {
  const { address: senderAddress, client } = useWallet();

  return useMutation<ExecuteResult, Error, any, any>(({ values, quoteDenom, id }) => {
    const { deconversion } = getDenomInfo(quoteDenom);
    const msg = {
      deposit: {
        vault_id: id,
      },
    };

    const funds = [{ denom: quoteDenom, amount: deconversion(values.topUpAmount).toString() }];

    const result = client!.execute(senderAddress, CONTRACT_ADDRESS, msg, 'auto', undefined, funds);
    return result;
  });
};
export default useTopUpStrategy;
