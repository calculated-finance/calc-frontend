import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { HttpBatchClient } from '@cosmjs/tendermint-rpc/build/rpcclients';
import { kujiraQueryClient } from 'kujira.js';
import { useEffect, useMemo, useState } from 'react';
import { CHAIN_ID, RPC_ENDPOINT } from 'src/constants';
import { ChildrenProp } from 'src/helpers/ChildrenProp';
import { Context } from './Context';

export function NetworkContext({ children }: ChildrenProp) {
  const [tmClient, setTmClient] = useState<null | Tendermint34Client>(null);

  useEffect(() => {
    const httpClient = new HttpBatchClient(RPC_ENDPOINT, {
      dispatchInterval: 100,
      batchSizeLimit: 200,
    });
    Tendermint34Client.create(httpClient).then(setTmClient);
  }, [setTmClient]);

  const query = useMemo(() => tmClient && kujiraQueryClient({ client: tmClient }), [tmClient]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <Context.Provider key={CHAIN_ID} value={{ tmClient, query }}>
      {children}
    </Context.Provider>
  );
}
