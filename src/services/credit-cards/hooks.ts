import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateCreditCardRequest, UpdateCreditCardRequest } from '@/types'

import { creditCardsApi } from './api'

// Keys para o cache do React Query
export const creditCardsKeys = {
  all: ['credit-cards'] as const,
  lists: () => [...creditCardsKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...creditCardsKeys.lists(), workspaceId] as const,
  details: () => [...creditCardsKeys.all, 'detail'] as const,
  detail: (workspaceId: string, cardId: string) =>
    [...creditCardsKeys.details(), workspaceId, cardId] as const,
  members: (workspaceId: string) => ['workspace-members', workspaceId] as const,
}

// Hook para listar cartões de crédito
export function useCreditCardsListQuery(workspaceId: string) {
  return useQuery({
    queryKey: creditCardsKeys.list(workspaceId),
    queryFn: () => creditCardsApi.list(workspaceId),
    enabled: !!workspaceId,
  })
}

// Hook para obter um cartão específico
export function useCreditCardQuery(workspaceId: string, cardId?: string) {
  return useQuery({
    queryKey: creditCardsKeys.detail(workspaceId, cardId || ''),
    queryFn: () => {
      if (!cardId) throw new Error('Card ID is required')
      return creditCardsApi.getById(workspaceId, cardId)
    },
    enabled: !!workspaceId && !!cardId,
  })
}

// Hook para listar membros do workspace
export function useWorkspaceMembersQuery(workspaceId: string) {
  return useQuery({
    queryKey: creditCardsKeys.members(workspaceId),
    queryFn: () => creditCardsApi.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  })
}

// Hook para criar cartão de crédito
export function useCreateCreditCardMutation(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCreditCardRequest) =>
      creditCardsApi.create(workspaceId, data),
    onSuccess: () => {
      // Invalidar cache dos cartões para recarregar a lista
      queryClient.invalidateQueries({
        queryKey: creditCardsKeys.list(workspaceId),
      })
    },
  })
}

// Hook para atualizar cartão de crédito
export function useUpdateCreditCardMutation(workspaceId: string, cardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCreditCardRequest) =>
      creditCardsApi.update(workspaceId, cardId, data),
    onSuccess: (updatedCard) => {
      // Atualizar cache da lista
      queryClient.invalidateQueries({
        queryKey: creditCardsKeys.list(workspaceId),
      })

      // Atualizar cache do cartão específico
      queryClient.setQueryData(
        creditCardsKeys.detail(workspaceId, cardId),
        updatedCard,
      )
    },
  })
}

// Hook para deletar cartão de crédito
export function useDeleteCreditCardMutation(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cardId: string) => creditCardsApi.delete(workspaceId, cardId),
    onSuccess: () => {
      // Invalidar cache dos cartões para recarregar a lista
      queryClient.invalidateQueries({
        queryKey: creditCardsKeys.list(workspaceId),
      })
    },
  })
}
