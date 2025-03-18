import { QueryClient } from "@tanstack/react-query";

// Simple mock data fetcher that returns static data
// This replaces the actual API calls since we're going fully static
async function staticDataFetcher<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 100); // Simulate network delay
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Static helper for data fetching
export async function getStaticData<T>(key: string, defaultData: T): Promise<T> {
  return staticDataFetcher(defaultData);
}