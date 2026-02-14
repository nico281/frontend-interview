import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useMutationWithError(options: Parameters<typeof useMutation>[0] & { errorMessage?: string }) {
  const { errorMessage = 'Something went wrong', ...mutationOptions } = options;

  return useMutation({
    ...mutationOptions,
    onError: (error, variables, context) => {
      toast.error(errorMessage);
      mutationOptions.onError?.(error, variables, context);
    },
  });
}
