import { getChainEndpoint } from '@helpers/chains';
import { useFormStore } from '@hooks/useFormStore';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum Chains {
  Kujira = 'Kujira',
  Osmosis = 'Osmosis',
}

type ChainState = {
  chain: Chains;
  setChain: (chain: Chains) => void;
  endpoint: string;
  setEndpoint: (endpoint: string) => void;
};

// default chain is set to Kujira
// default endpoint should be set to Kujira
// when chain is changed, endpoint should be changed to default endpoint of that chain
// when endpoint is changed it shoud be updated and refresh cosmos client

// getChainEndpoint currently gets the endpoint from the constants

export const useChainStore = create<ChainState>()(
  persist(
    (set, get) => ({
      chain: Chains.Kujira,
      setChain: (chain: Chains) => {
        useFormStore.setState({ forms: {} });

        // get the default endpoint for the chain
        // set the endpoint to the default endpoint
        get().setEndpoint(getChainEndpoint(chain));

        return set({ chain });
      },
      endpoint: getChainEndpoint(Chains.Kujira),
      setEndpoint: (endpoint: string) => {
        return set({ endpoint });
      },
    }),
    {
      name: 'chain',
    },
  ),
);

export const useChain = () => {
  const router = useRouter();
  const chain = useChainStore((state) => state.chain);
  const setChain = useChainStore((state) => state.setChain);
  const endpoint = useChainStore((state) => state.endpoint);
  const setEndpoint = useChainStore((state) => state.setEndpoint);

  const [data, setData] = useState<ChainState>();

  // this is for deep linking
  useEffect(() => {
    if (router.isReady) {
      const { chain: queryParamChain, ...otherParams } = router.query;
      if (queryParamChain) {
        setChain(queryParamChain as Chains);
        router.replace({
          pathname: router.pathname,
          query: otherParams,
        });
      }
      setData({ chain, setChain, endpoint, setEndpoint });
    }
  }, [router, setChain, chain]);

  return data || ({} as ChainState);
};
