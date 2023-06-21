import { getStrategyInitialDenom } from '@helpers/strategy';
import { Strategy } from '@models/Strategy';
import { ethers } from 'ethers';
import { getDenomContract } from 'src/interfaces/evm/getDenomContract';
import { getVaultContract } from '../../interfaces/evm/getVaultContract';

export async function executeTopUpEVM(
  provider: ethers.BrowserProvider,
  signer: ethers.JsonRpcSigner,
  strategy: Strategy,
  topUpAmount: number,
) {
  const { deconversion, id: initialDenomId } = getStrategyInitialDenom(strategy);
  const vaultContract = getVaultContract(provider, strategy.id);

  const contractWithSigner = vaultContract.connect(signer);

  const denom = getDenomContract(provider, initialDenomId);

  console.log(topUpAmount);

  const approveRes = await denom.approve(strategy.id, topUpAmount);
  await approveRes.wait();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tx = await contractWithSigner.deposit(ethers.parseEther(topUpAmount.toString()));
  const receipt = await tx.wait();

  return receipt;
}
