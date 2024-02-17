import { QueryCache, QueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { toast } from '@components/ToastContainer';
import { join } from 'rambda';

const ignoredErrors = ['Load failed', 'Failed to fetch'];

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const key = join('-', query.queryKey as string[]);

      if (toast.isActive(key)) return;

      const { errorMessage } = (query.meta as { errorMessage: string }) || {};

      if (!ignoredErrors.find((i) => (error as Error).message?.includes(i))) {
        Sentry.captureException(error, { tags: { queryKey: key, errorMessage } });
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
