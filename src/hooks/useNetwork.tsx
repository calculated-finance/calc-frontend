/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/function-component-definition */
import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { KujiraQueryClient, kujiraQueryClient } from 'kujira.js';
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
  tmClient: Tendermint34Client | null;
  query: KujiraQueryClient | null;
};

const MyContext = createContext<NetworkContext>({
  tmClient: null,
  query: null,
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
  const network = CHAIN_ID;

  const [tm, setTmClient] = useState<null | [Tendermint34Client, string]>(null);

  const tmClient = tm && tm[0];

  useEffect(() => {
    toClient(RPC_ENDPOINT)
      .then(setTmClient)
      .catch((err) => (onError ? onError(err) : console.error(err)));
  }, []);

  const query = useMemo(() => tmClient && kujiraQueryClient({ client: tmClient }), [tmClient]);

  return (
    tm && (
      <MyContext.Provider
        key={network}
        value={{
          tmClient,
          query,
        }}
      >
        {children}
      </MyContext.Provider>
    )
  );
};

export const useNetwork = (): {
  tmClient: Tendermint34Client | null;
  query: KujiraQueryClient | null;
} => {
  const { tmClient, query } = useContext(MyContext);

  return {
    tmClient,
    query,
  };
};
