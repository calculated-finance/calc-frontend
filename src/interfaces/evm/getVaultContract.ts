import { ethers } from 'ethers';
import vaultContractJson from './Vault.json';

export function getVaultContract(provider: ethers.BrowserProvider, strategyId: string) {
  return new ethers.Contract(strategyId, vaultContractJson.abi, provider);
}
