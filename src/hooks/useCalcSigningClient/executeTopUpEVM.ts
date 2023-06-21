import { ethers } from 'ethers';
import vaultContractJson from 'src/Vault.json';

type VaultContract = {
  deposit: (value: ethers.BigNumberish) => Promise<ethers.ContractTransaction>;
  getBalance: () => Promise<ethers.BigNumberish>;
};

function getVaultContract(provider: ethers.BrowserProvider, strategyId: string) {
  return new ethers.Contract(strategyId, vaultContractJson.abi, provider);
}

export async function executeTopUpEVM(
  provider: ethers.BrowserProvider,
  signer: ethers.JsonRpcSigner,
  strategyId: string,
  topUpAmount: number,
) {
  const vaultContract = getVaultContract(provider, strategyId);

  const contractWithSigner = vaultContract.connect(signer);

  console.log(topUpAmount);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tx = await contractWithSigner.deposit(ethers.parseEther(topUpAmount.toString()));
  const receipt = await tx.wait();

  return receipt;
}
