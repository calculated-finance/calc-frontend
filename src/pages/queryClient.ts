import { QueryCache, QueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { toast } from './toast';

const ignoredErrors = ['Load failed', 'Failed to fetch'];

// disable retries on testnet
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      const label = query.queryKey[0] as string;
      const { errorMessage } = (query.meta as { errorMessage: string }) || {};

      if (!ignoredErrors.find((i) => (error as Error).message?.includes(i))) {
        Sentry.captureException(error, { tags: { queryKey: label, errorMessage } });
      }

      toast({
        title: 'Something went wrong',
        position: 'top-right',
        description: `There was a problem while loading (Reason: ${error}) (Query: ${errorMessage}))`,
        status: 'error',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      });
    },
  }),
});
