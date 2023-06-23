import { Strategy } from '@models/Strategy';
import getDenomInfo from '@utils/getDenomInfo';
import { formatEther } from 'ethers';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';

export function transformToStrategyEVM(result: any, balance: any, id: string): Strategy {
  const { deconversion } = getDenomInfo(result.tokenIn);

  const owner = result.owner as string;
  const status = balance ? 'active' : 'inactive';

  const vaultRawData = {
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
  } as Vault;

  return { id, owner, status, rawData: vaultRawData };
}
