import { Contract, ContractRunner } from 'ethers';
import vaultContractJson from '../Vault.json';

export default function getVaultContract(contractRunner: ContractRunner, strategyId: string) {
  return new Contract(strategyId, vaultContractJson.abi, contractRunner);
}
