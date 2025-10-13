import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry configuration
      retry: (failureCount, error) => {
        // Não retry em erros 4xx (client errors)
        const status = (error as { status?: number } | null)?.status
        if (status && status >= 400 && status < 500) {
          return false
        }
        return failureCount < 2
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Cache configuration
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
      
      // Refetch configuration
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: true,
      
      // Network mode
      networkMode: 'online',
    },
    mutations: {
      retry: (failureCount, error) => {
        // Não retry em erros 4xx para mutations
        const status = (error as { status?: number } | null)?.status
        if (status && status >= 400 && status < 500) {
          return false
        }
        return failureCount < 1
      },
      networkMode: 'online',
    },
  },
})
