import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

export interface UseDataOptions {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
  dedupingInterval?: number;
}

export function useData<T>(
  url: string | null,
  options: UseDataOptions = {}
) {
  const {
    refreshInterval,
    revalidateOnFocus = true,
    dedupingInterval = 2000,
  } = options;

  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus,
      dedupingInterval,
      suspense: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}