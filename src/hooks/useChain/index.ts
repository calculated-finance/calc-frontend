import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useFormStore } from '@hooks/useFormStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Chains } from './Chains';

type ChainState = {
  chain: Chains;
  setChain: (chain: Chains) => void;
};

// export const useChainStore = create<ChainState>()(
//   persist(
//     (set) => ({
//       chain: Chains.Kujira,
//       setChain: (chain: Chains) => set({ chain }),
//     }),
//     {
//       name: 'chain',
//     },
//   ),
// );

export const useChain = () => {
  const router = useRouter();
  const { chain } = useMemo(() => router.query, [router.query]);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ChainState>({} as ChainState);

  const updateQueryParam = useCallback((newChain: Chains) => {
    console.log('updateQueryParam', newChain);
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, chain: newChain },
    });
  }, [router]);


  const setChain = useCallback((newChain: Chains) => {
    console.log('setChain', newChain);
    useFormStore.setState({ forms: {} });
    useCosmWasmClient.setState({ client: null });
    updateQueryParam(newChain)
  }, [router]);



  useEffect(() => {
    if (router.isReady) {
      if(chain) {
        setData({ chain: chain as Chains, setChain });
      } else {
        setData({ chain: Chains.None, setChain });
      }
      setIsLoading(false);
    }
      
  }, [router.isReady, setChain, chain]);


  return {...data as ChainState, isLoading}
};
