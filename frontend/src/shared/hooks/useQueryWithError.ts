import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useQueryWithError<T>(options: Parameters<typeof useQuery<T>>[0] & { errorMessage?: string }) {
  const { errorMessage = 'Something went wrong', ...queryOptions } = options;
  const query = useQuery<T>(queryOptions);
  const lastErrorCount = useRef(query.errorUpdateCount);

  useEffect(() => {
    if (query.errorUpdateCount > lastErrorCount.current) {
      toast.error(errorMessage);
      lastErrorCount.current = query.errorUpdateCount;
    }
  }, [query.errorUpdateCount, errorMessage]);

  return query;
}
