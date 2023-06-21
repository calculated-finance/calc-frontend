import { BrowserProvider, ethers, formatEther } from 'ethers';
import getDenomInfo from '@utils/getDenomInfo';
import { getVaultContract } from 'src/interfaces/evm/getVaultContract';
import { Strategy } from '../../models/Strategy';

export async function fetchStrategyEVM(id: string, provider: BrowserProvider): Promise<Strategy> {
  const vaultContract = getVaultContract(provider, id);

  const result = await vaultContract.getConfig();

  const balanceResponse = await vaultContract.getBalance();

  // console.log('balance',balance)
  // console.log('addressProviderAddress', result.addressProviderAddress)
  // console.log('owner', result.owner)
  // console.log('tokenIn', result.tokenIn)
  // console.log('totalTokenInSent', result.totalTokenInSent)
  // console.log('tokenOut', result.tokenOut)
  // console.log('totalTokenOutReceived', result.totalTokenOutReceived)
  // console.log('swapAmount', result.swapAmount)
  // console.log('preSwapAutomationAddress', result.preSwapAutomationAddress)
  // console.log('swapAdjustmentAddress', result.swapAdjustmentAddress)
  //     console.log('postSwapAutomations', result.postSwapAutomations)
  //     console.log('postSwapAutomations.postSwapAutomationAddress', result.postSwapAutomations.postSwapAutomationAddress)
  //     console.log('postSwapAutomations.destination', result.postSwapAutomations.destination)
  //     console.log('postSwapAutomations.basisPoints', result.postSwapAutomations.basisPoints)
  // console.log('finaliserAddress', result.finaliserAddress)
  // console.log('referenceVaultAddress', result.referenceVaultAddress)
  // console.log('triggerCreationConditionAddress', result.triggerCreationConditionAddress)
  // console.log('performSwapConditionAddress', result.performSwapConditionAddress)
  // console.log('finaliseVaultConditionAddress', result.finaliseVaultConditionAddress)
  // console.log('timeInterval', result.timeInterval)
  // console.log('targetTime', result.targetTime)
  // console.log('simulation', result.simulation)
  const balance = balanceResponse;

  console.log('balance', formatEther(balance));
  const { deconversion } = getDenomInfo(result.tokenIn);

  return {
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
  } as Strategy;
}
