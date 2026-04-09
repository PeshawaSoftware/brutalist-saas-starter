import { useState, useCallback, useEffect } from 'react';
import { apiService } from '@/lib/api';
import type { ApiResponse } from '@/types';

interface UseApiOptions {
  autoFetch?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useApi = <T,>(
  asyncFunction: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFunction();

      if (response.success && response.data) {
        setData(response.data);
        options.onSuccess?.(response.data);
      } else {
        const errorMsg = response.error || 'An error occurred';
        setError(errorMsg);
        options.onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      options.onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, options]);

  useEffect(() => {
    if (options.autoFetch) {
      execute();
    }
  }, [execute, options.autoFetch]);

  return { data, loading, error, execute };
};

export const useLogin = () => {
  return useApi(
    async () => {
      return { success: true, data: null };
    },
    { autoFetch: false }
  );
};

export const useSignup = () => {
  return useApi(
    async () => {
      return { success: true, data: null };
    },
    { autoFetch: false }
  );
};
