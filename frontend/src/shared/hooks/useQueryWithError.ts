import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useQueryWithError<T>(options: Parameters<typeof useQuery<T>>[0] & { errorMessage?: string }) {
  const { errorMessage = 'Something went wrong', ...queryOptions } = options;
  const query = useQuery<T>(queryOptions);

  useEffect(() => {
    if (query.error && !query.isFetching) {
      toast.error(errorMessage);
    }
  }, [query.error, query.isFetching, errorMessage]);

  return query;
}
