import { toast } from 'sonner';

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    promise: <T>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string;
        error: string;
      },
    ) => toast.promise(promise, { loading, success, error }),
  };
}
