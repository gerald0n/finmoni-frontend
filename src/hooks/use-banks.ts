import { useQuery } from '@tanstack/react-query'

import { BrasilAPIService } from '@/services/brasilapi'

/**
 * Hook para buscar a lista de bancos brasileiros
 */
export function useBanksQuery() {
  return useQuery({
    queryKey: ['banks', 'brasil-api'],
    queryFn: async () => {
      const banks = await BrasilAPIService.getBanks()
      return BrasilAPIService.formatBanksForSelect(banks)
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 horas - dados de bancos não mudam frequentemente
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Hook para buscar um banco específico pelo código
 */
export function useBankByCodeQuery(code?: string) {
  return useQuery({
    queryKey: ['bank', 'brasil-api', code],
    queryFn: () => BrasilAPIService.getBankByCode(code || ''),
    enabled: !!code,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
  })
}