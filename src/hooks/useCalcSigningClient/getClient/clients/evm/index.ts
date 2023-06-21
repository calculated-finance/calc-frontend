import { JsonRpcSigner, ethers, parseEther } from 'ethers';

import { getStrategyInitialDenom } from '@helpers/strategy';
import { getDenomContract } from 'src/interfaces/evm/getDenomContract';
import { Strategy } from '@models/Strategy';
import getVaultContract from 'src/interfaces/evm/getVaultContract';

async function executeTopUpEVM(signer: ethers.JsonRpcSigner, strategy: Strategy, topUpAmount: number) {
  const { deconversion, id: initialDenomId } = getStrategyInitialDenom(strategy);
  const contractWithSigner = getVaultContract(signer, strategy.id);

  const denom = getDenomContract(signer, initialDenomId);

  const parsedAmount = parseEther(topUpAmount.toString());

  const approveRes = await denom.approve(strategy.id, parsedAmount);
  await approveRes.wait();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tx = await contractWithSigner.deposit(parsedAmount);
  const receipt = await tx.wait();

  return receipt;
}

export function getEVMSigningClient(evmSigner: JsonRpcSigner) {
  return {
    topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
      executeTopUpEVM(evmSigner, strategy, topUpAmount),
  };
}
