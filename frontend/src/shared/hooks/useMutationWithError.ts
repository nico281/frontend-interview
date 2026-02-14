import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useMutationWithError<TData, TError, TVariables, TContext>(
  options: Parameters<typeof useMutation<TData, TError, TVariables, TContext>>[0] & { errorMessage?: string },
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { errorMessage = 'Something went wrong', ...mutationOptions } = options;

  return useMutation({
    ...mutationOptions,
    onError: (error, variables, context) => {
      toast.error(errorMessage);
      mutationOptions.onError?.(error, variables, context);
    },
  });
}
