import dynamic from 'next/dynamic';

export const dynamicImport = (
  importFn: () => Promise<unknown>,
  options = {}
) => {
  return dynamic(importFn, {
    ssr: true,
    loading: () => null,
    ...options,
  });
};