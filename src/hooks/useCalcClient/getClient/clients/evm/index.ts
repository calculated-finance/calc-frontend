import { Strategy } from '@models/Strategy';
import { BrowserProvider } from 'ethers';
import getVaultContract from 'src/interfaces/evm/getVaultContract';
import { transformToStrategy } from './transformToStrategy';

export async function fetchStrategyEVM(id: string, provider: BrowserProvider): Promise<Strategy> {
  const vaultContract = getVaultContract(provider, id);
  const result = await vaultContract.getConfig();
  const balanceResponse = await vaultContract.getBalance();
  const balance = balanceResponse;

  return transformToStrategy(result, balance, id);
}

export default function getEVMClient(evmProvider: BrowserProvider) {
  return {
    fetchStrategy: (id: string) => fetchStrategyEVM(id, evmProvider),
    fetchStrategyEvents: (id: string) => Promise.resolve([]),
  };
}
