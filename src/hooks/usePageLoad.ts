import { useBoolean } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function usePageLoad(initialState = false) {
  const router = useRouter();
  const [isPageLoading, setPageLoading] = useBoolean(initialState);

  useEffect(() => {
    router.events.on('routeChangeStart', setPageLoading.on);
    router.events.on('routeChangeComplete', setPageLoading.off);
    router.events.on('routeChangeError', setPageLoading.off);

    return () => {
      router.events.on('routeChangeStart', setPageLoading.on);
      router.events.on('routeChangeComplete', setPageLoading.off);
      router.events.on('routeChangeError', setPageLoading.off);
    };
  });

  return { isPageLoading, setPageLoading };
}

export default usePageLoad;
