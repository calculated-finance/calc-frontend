import { Strategy } from '@models/Strategy';
import getDenomInfo from '@utils/getDenomInfo';
import { formatEther } from 'ethers';

export function transformToStrategy(result: any, balance: any, id: string) {
  const { deconversion } = getDenomInfo(result.tokenIn);

  const vaultRawData = {
    status: balance ? 'active' : 'inactive',
    balance: {
      denom: result.tokenIn,
      amount: deconversion(Number(formatEther(balance))).toString(),
    },
    received_amount: {
      denom: result.tokenOut,
      amount: formatEther(result.totalTokenOutReceived),
    },
    swapped_amount: {
      denom: result.tokenIn,
      amount: formatEther(result.totalTokenInSent),
    },
    destinations: [
      {
        address: 'kujiratestwallet',
        allocation: '1',
      },
    ],
    time_interval: { custom: { seconds: Number(result.timeInterval.toString()) } },
    swap_amount: formatEther(result.swapAmount),
    id,
  };

  return { id, rawData: vaultRawData } as Strategy;
}
