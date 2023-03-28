/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/function-component-definition */
import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { ChainInfo } from '@keplr-wallet/types';
import { useCookieState } from 'ahooks';
import { CHAIN_INFO, KujiraQueryClient, kujiraQueryClient, MAINNET, NETWORK, RPCS } from 'kujira.js';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CHAIN_ID, RPC_ENDPOINT } from 'src/constants';

export type NetworkContext = {
  network: NETWORK;
  setNetwork: (n: NETWORK) => void;
  tmClient: Tendermint34Client | null;
  query: KujiraQueryClient | null;
  rpc: string;
  // rpcs: { endpoint: string; latency: number }[];
  setRpc: (val: string) => void;
  preferred: string | null;
  unlock: () => void;
  lock: () => void;
};

const MyContext = createContext<NetworkContext>({
  network: CHAIN_ID,
  setNetwork: () => {},
  tmClient: null,
  query: null,
  rpc: '',
  // rpcs: [],
  setRpc: () => {},
  preferred: null,
  unlock: () => {},
  lock: () => {},
});

const toClient = (
  endpoint: string,
  setLatencies?: Dispatch<SetStateAction<Record<string, number>>>,
): Promise<[Tendermint34Client, string]> => {
  const start = new Date().getTime();
  return Tendermint34Client.create(
    new HttpBatchClient(endpoint, {
      dispatchInterval: 100,
      batchSizeLimit: 200,
    }),
  ).then((c) => {
    setLatencies &&
      setLatencies((prev) => ({
        ...prev,
        [endpoint]: new Date().getTime() - start,
      }));
    return [c, endpoint];
  });
};

export const NetworkContext: React.FC<
  PropsWithChildren<{
    onError?: (err: any) => void;
  }>
> = ({ children, onError }) => {
  const [network, setNetwork] = useCookieState('network', { defaultValue: CHAIN_ID });

  const [preferred, setPreferred] = useCookieState('rpc', { defaultValue: RPC_ENDPOINT });

  const [tm, setTmClient] = useState<null | [Tendermint34Client, string]>(null);
  const [latencies, setLatencies] = useState<Record<string, number>>({});

  const tmClient = tm && tm[0];

  useEffect(() => {
    toClient(RPC_ENDPOINT)
      .then(setTmClient)
      .catch((err) => (onError ? onError(err) : console.error(err)));
  }, [network]);

  const setRpc = (val: string) => {
    toClient(val)
      .then(setTmClient)
      .catch((err) => (onError ? onError(err) : console.error(err)));
  };

  const unlock = () => {
    setPreferred('');
  };

  const lock = () => {
    tm && setPreferred(tm[1]);
  };

  const query = useMemo(() => tmClient && kujiraQueryClient({ client: tmClient }), [tmClient]);

  return (
    tm && (
      <MyContext.Provider
        key={network}
        value={{
          network,
          setNetwork,
          tmClient,
          query,
          rpc: tm[1],
          // rpcs: RPCS[network as NETWORK].map((endpoint) => ({
          //   endpoint,
          //   latency: latencies[endpoint] || 9999,
          // })),
          setRpc,
          unlock,
          lock,
          preferred: preferred || null,
        }}
      >
        {children}
      </MyContext.Provider>
    )
  );
};

export const useNetwork = (): [
  {
    network: NETWORK;
    chainInfo: ChainInfo;
    tmClient: Tendermint34Client | null;
    query: KujiraQueryClient | null;
    rpc: string;
    rpcs: { endpoint: string; latency: number }[];
    setRpc: (val: string) => void;
    preferred: null | string;
    unlock: () => void;
    lock: () => void;
  },
  (n: NETWORK) => void,
] => {
  const { network, setNetwork, tmClient, query, rpc, setRpc, preferred, lock, unlock, rpcs } = useContext(MyContext);

  return [
    {
      network,
      chainInfo: CHAIN_INFO[network],
      tmClient,
      query,
      rpc,
      rpcs,
      setRpc,
      preferred,
      lock,
      unlock,
    },
    setNetwork,
  ];
};
