import { useToast } from '@chakra-ui/react';
import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

export default function useQueryWithNotification<TQueryFnData = unknown>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options: UseQueryOptions<TQueryFnData, Error> = {},
) {
  const toast = useToast();
  const label = queryKey[0];

  return useQuery<TQueryFnData, Error>(queryKey, queryFn, {
    ...options,
    onError: (error: Error) => {
      toast({
        title: 'Something went wrong',
        position: 'top-right',
        description: `There was a problem while loading (Reason: ${error.message}, key: ${label})`,
        status: 'error',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      });
    },
  });
}
