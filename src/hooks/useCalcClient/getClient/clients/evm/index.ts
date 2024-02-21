import { Strategy } from '@models/Strategy';
import { BrowserProvider, formatEther, formatUnits } from 'ethers';
import { StrategyEvent } from '@models/StrategyEvent';
import getEventManagerContract from 'src/interfaces/evm/getEventManagerContract';
import { getStrategyInitialDenom, getStrategyResultingDenom } from '@helpers/strategy';
import getVaultContract from 'src/interfaces/evm/getVaultContract/';
import getFactoryContract from 'src/interfaces/evm/getFactoryContract';
import { transformToStrategyEVM } from './transformToStrategy';

export async function fetchStrategyEVM(id: string, provider: BrowserProvider): Promise<Strategy> {
  const vaultContract = getVaultContract(provider, id);
  const result = await vaultContract.getConfig();
  const balanceResponse = await vaultContract.getBalance();
  const balance = balanceResponse;

  return transformToStrategyEVM(result, balance, id);
}

export async function fetchStrategyEvents(id: string, provider: BrowserProvider): Promise<StrategyEvent[]> {
  const contract = getEventManagerContract(provider);
  const events = await contract.getDcaVaultExecutionCompletedEvents(id, '0', '100');

  const strategy = await fetchStrategyEVM(id, provider);

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const transformedEvents = events.map((event: any) => ({
    id: 1,
    data: {
      dca_vault_execution_completed: {
        fee: {
          amount: '0',
          denom: resultingDenom.id,
        },
        received: {
          amount: formatEther(event.received * BigInt(10 ** resultingDenom.significantFigures)),
          denom: resultingDenom.id,
        },
        sent: {
          amount: formatEther(event.sent * BigInt(10 ** initialDenom.significantFigures)),
          denom: initialDenom.id,
        },
      },
    },
    resource_id: event.vaultAddress,
    timestamp: (Number(formatUnits(event.timestamp, 0)) * 1000000000).toString(),
    block_height: event.blockHeight,
  }));

  return transformedEvents;
}

async function fetchStrategies(userAddress: string, provider: BrowserProvider): Promise<Strategy[]> {
  const factoryContract = getFactoryContract(provider);

  const result = await factoryContract
    .getVaultsByAddress(userAddress)
    .then((ids: string[]) => Promise.all(ids.map((id: string) => fetchStrategyEVM(id, provider))));

  return result as Strategy[];
}

export default function getEVMClient(evmProvider: BrowserProvider) {
  return {
    fetchStrategy: (id: string) => fetchStrategyEVM(id, evmProvider),
    fetchStrategyEvents: (id: string) => fetchStrategyEvents(id, evmProvider),
    fetchStrategies: (userAddress: string) => fetchStrategies(userAddress, evmProvider),
  };
}
