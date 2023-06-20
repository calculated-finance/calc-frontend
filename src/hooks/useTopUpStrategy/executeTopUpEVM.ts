import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { DenomInfo } from '@utils/DenomInfo';
import { ethers } from 'ethers';
import vaultContractJson from 'src/Vault.json';
import { Chains } from '../useChain/Chains';

type VaultContract = {
  deposit: (value: ethers.BigNumberish) => Promise<ethers.ContractTransaction>;
  getBalance: () => Promise<ethers.BigNumberish>;
};

function getVaultContract(provider: ethers.BrowserProvider, strategyId: string) {
  return new ethers.Contract(strategyId, vaultContractJson.abi, provider);
}

export async function executeTopUpEVM(
  initialDenom: DenomInfo,
  address: string,
  provider: ethers.BrowserProvider,
  signer: ethers.JsonRpcSigner,
  chain: Chains,
  strategyId: string,
  topUpAmount: number,
) {
  const vaultContract = new ethers.Contract(strategyId, vaultContractJson.abi, provider);

  const contractWithSigner = vaultContract.connect(signer);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tx = await contractWithSigner.deposit({
    value: ethers.parseEther(topUpAmount.toString()),
  });

  const receipt = await tx.wait();

  return receipt;
}
