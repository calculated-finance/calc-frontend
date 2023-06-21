import { ContractRunner, ethers } from 'ethers';
import vaultContractJson from '../Vault.json';

export default function getVaultContract(contractRunner: ContractRunner, strategyId: string) {
  return new ethers.Contract(strategyId, vaultContractJson.abi, contractRunner);
}
