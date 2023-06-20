import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useMetamask } from '@hooks/useMetamask';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useKujira } from '@hooks/useKujira';
import { useOsmosis } from '@hooks/useOsmosis';
import { KujiraQueryClient } from 'kujira.js';
import { Coin } from '@models/index';
import { useWallet } from '@hooks/useWallet';
import { Strategy } from '@models/Strategy';
import { fetchStrategyEVM } from './fetchStrategy';
import { executeTopUpCosmos } from './executeTopUpCosmos';
import { executeTopUpEVM } from './executeTopUpEVM';
import { fetchBalanceEvm } from './fetchBalanceEvm';
import { fetchStrategyCosmos } from './fetchStrategyCosmos';

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
  evmSigner: JsonRpcSigner | null,
  cosmSigner: SigningCosmWasmClient | null | undefined,
) {
  if (chain === Chains.Moonbeam) {
    if (!evmProvider) return null;
    if (!evmSigner) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyEVM(id, evmProvider),
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpEVM(evmProvider, evmSigner, strategy.id, topUpAmount),
      fetchTokenBalance: (tokenId: string, address: string) => fetchBalanceEvm(tokenId, evmProvider, address),
      fetchBalances: (address: string, supportedDenoms: string[]) =>
        Promise.all(supportedDenoms.map((denom) => fetchBalanceEvm(denom, evmProvider, address))),
    };
  }

  if (chain === Chains.Kujira) {
    if (!kujiraQueryClient) return null;
    if (!cosmClient) return null;
    if (!cosmSigner) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyCosmos(cosmClient, chain, id),
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpCosmos(address, cosmSigner, chain, strategy, topUpAmount),
      fetchTokenBalance: (tokenId: string, address: string) => cosmClient.getBalance(address, tokenId),
      fetchBalances: (address: string, supportedDenoms: string[]) =>
        fetchBalancesKujira(kujiraQueryClient, address, supportedDenoms),
    };
  }

  if (chain === Chains.Osmosis) {
    if (!osmosisQueryClient) return null;
    if (!cosmClient) return null;
    if (!cosmSigner) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyCosmos(cosmClient, chain, id),
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpCosmos(address, cosmSigner, chain, strategy, topUpAmount),
      fetchTokenBalance: (tokenId: string, address: string) => cosmClient.getBalance(address, tokenId),
      fetchBalances: fetchBalancesOsmosis(osmosisQueryClient),
    };
  }

  throw new Error('Unsupported chain');
}

export function useCalcClient(chain: Chains) {
  const evmProvider = useMetamask((state) => state.provider);
  const evmSigner = useMetamask((state) => state.signer);
  const { signingClient: cosmSigner } = useWallet();
  const cosmClient = useCosmWasmClient((state) => state.client);

  const kujiraQuery = useKujira((state) => state.query);
  const osmosisQuery = useOsmosis((state) => state.query);

  if (!chain) return null;

  return getClient(chain, cosmClient, evmProvider, kujiraQuery, osmosisQuery, evmSigner, cosmSigner);
}
