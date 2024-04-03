import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Tendermint34Client, HttpBatchClient } from '@cosmjs/tendermint-rpc';
import { getChainEndpoint } from '@helpers/chains';
import { ChainId } from '@models/ChainId';
import { InitialDenomInfo, ResultingDenomInfo, fromPartial } from '@utils/DenomInfo';
import { kujiraQueryClient } from 'kujira.js';
import Long from 'long';
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { reduce, toPairs } from 'rambda';
import { DENOMS } from 'src/fixtures/denoms';
import { ChainClient, fetchAllPairsFromSwapper } from './helpers';

const fetchDenoms = (chainId: ChainId): Promise<{ [x: string]: InitialDenomInfo }> =>
  Promise.resolve(
    reduce(
      (acc: { [x: string]: InitialDenomInfo }, [id, info]: [string, Partial<InitialDenomInfo>]) => ({
        ...acc,
        [id]: fromPartial({ chain: chainId, id, ...info }),
      }),
      {},
      toPairs(DENOMS[chainId]),
    ),
  );

export const kujiraChainClient = async (chainId: ChainId, cosmWasmClient: CosmWasmClient): Promise<ChainClient> => {
  const client = await Tendermint34Client.create(
    new HttpBatchClient(getChainEndpoint(chainId), {
      dispatchInterval: 100,
      batchSizeLimit: 200,
    }),
  );

  const queryClient = kujiraQueryClient({ client: client as any });

  return {
    fetchDenoms: () => fetchDenoms(chainId),
    fetchPairs: fetchAllPairsFromSwapper,
    fetchTokenBalance: (address: string, denom: InitialDenomInfo) => cosmWasmClient!.getBalance(address, denom.id),
    fetchBalances: (address: string) =>
      queryClient.bank.allBalances(address, {
        key: Buffer.from(''),
        offset: Long.fromInt(0),
        limit: Long.fromInt(1000),
        countTotal: false,
        reverse: false,
      }),
    fetchValidators: async () =>
      (await queryClient.staking.validators('BOND_STATUS_BONDED')) as unknown as { validators: Validator[] },
    fetchRoute: async (_: InitialDenomInfo, __: ResultingDenomInfo, ___: bigint) => ({
      route: undefined,
      feeRate: 0.0075,
      routeError: undefined,
    }),
  };
};
