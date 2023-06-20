import vaultContractJson from 'src/Vault.json';
import { BrowserProvider, ethers } from 'ethers';
import getDenomInfo from '@utils/getDenomInfo';
import { Strategy } from '../models/Strategy';

export async function fetchStrategy(id: string, provider: BrowserProvider): Promise<Strategy> {
  const vaultContract = new ethers.Contract(id, vaultContractJson.abi, provider);

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
  const balance = ethers.parseEther(balanceResponse.toString());

  const { conversion } = getDenomInfo(result.tokenIn);
  return {
    status: balance ? 'active' : 'inactive',
    balance: {
      denom: result.tokenIn.toUpperCase(),
      amount: ethers.parseEther(balance.toString()).toString(),
    },
    received_amount: {
      denom: result.tokenOut.toUpperCase(),
      amount: ethers.parseEther(result.totalTokenOutReceived.toString()).toString(),
    },
    swapped_amount: {
      denom: result.tokenIn.toUpperCase(),
      amount: ethers.parseEther(result.totalTokenInSent.toString()).toString(),
    },
    destinations: [
      {
        address: 'kujiratestwallet',
        allocation: '1',
      },
    ],
    time_interval: { custom: { seconds: Number(result.timeInterval.toString()) } },
    swap_amount: conversion(Number(result.swapAmount)).toString(),
    id,
  } as Strategy;
}
