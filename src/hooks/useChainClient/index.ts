import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useMetamask } from '@hooks/useMetamask';
import { BrowserProvider } from 'ethers';
import { useKujira } from '@hooks/useKujira';
import { useOsmosis } from '@hooks/useOsmosis';
import { KujiraQueryClient } from 'kujira.js/lib/cjs/queryClient';
import { Coin } from '@models/index';
import { fetchBalanceEvm } from './fetchBalanceEvm';

function fetchBalancesKujira(kujiraQueryClient: KujiraQueryClient, address: string, supportedDenoms: string[]) {
  return kujiraQueryClient.bank
    .allBalances(address)
    .then((balances: Coin[]) => balances.filter((balance: Coin) => supportedDenoms.includes(balance.denom)));
}

function fetchBalancesOsmosis(osmosisQueryClient: any) {
  return (address: string, supportedDenoms: string[]) =>
    osmosisQueryClient?.cosmos.bank.v1beta1
      .allBalances({ address })
      .then((res: { balances: Coin[] }) => res.balances)
      .then((balances: Coin[]) => balances.filter((balance: Coin) => supportedDenoms.includes(balance.denom)));
}

function getClient(
  chain: Chains,
  cosmClient: CosmWasmClient | null,
  evmProvider: BrowserProvider | null,
  kujiraQueryClient: KujiraQueryClient | null,
  osmosisQueryClient: any | null,
) {
  if (chain === Chains.Moonbeam) {
    if (!evmProvider) return null;

    return {
      fetchTokenBalance: (tokenId: string, address: string) => fetchBalanceEvm(tokenId, evmProvider, address),
      fetchBalances: (address: string, supportedDenoms: string[]) =>
        Promise.all(supportedDenoms.map((denom) => fetchBalanceEvm(denom, evmProvider, address))),
    };
  }

  if (chain === Chains.Kujira) {
    if (!kujiraQueryClient) return null;
    if (!cosmClient) return null;

    return {
      fetchTokenBalance: (tokenId: string, address: string) => cosmClient.getBalance(address, tokenId),
      fetchBalances: (address: string, supportedDenoms: string[]) =>
        fetchBalancesKujira(kujiraQueryClient, address, supportedDenoms),
    };
  }

  if (chain === Chains.Osmosis) {
    if (!osmosisQueryClient) return null;
    if (!cosmClient) return null;

    return {
      fetchTokenBalance: (tokenId: string, address: string) => cosmClient.getBalance(address, tokenId),
      fetchBalances: fetchBalancesOsmosis(osmosisQueryClient),
    };
  }

  throw new Error('Unsupported chain');
}

export function useChainClient(chain: Chains) {
  const evmProvider = useMetamask((state) => state.provider);
  const cosmClient = useCosmWasmClient((state) => state.client);

  const kujiraQuery = useKujira((state) => state.query);
  const osmosisQuery = useOsmosis((state) => state.query);

  if (!chain) return null;

  return getClient(chain, cosmClient, evmProvider, kujiraQuery, osmosisQuery);
}
