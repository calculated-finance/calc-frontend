import { getStrategyInitialDenom } from '@helpers/strategy';
import { Strategy } from '@models/Strategy';
import { ethers, parseEther } from 'ethers';
import { getDenomContract } from 'src/interfaces/evm/getDenomContract';
import { getVaultContract } from '../../interfaces/evm/getVaultContract';

export async function executeTopUpEVM(
  provider: ethers.BrowserProvider,
  signer: ethers.JsonRpcSigner,
  strategy: Strategy,
  topUpAmount: number,
) {
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
