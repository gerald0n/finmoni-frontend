import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateBankAccountRequest, UpdateBankAccountRequest } from '@/types'

import { accountsApi } from './api'

// Keys para o cache do React Query
export const accountsKeys = {
  all: ['bank-accounts'] as const,
  lists: () => [...accountsKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...accountsKeys.lists(), workspaceId] as const,
  details: () => [...accountsKeys.all, 'detail'] as const,
  detail: (workspaceId: string, accountId: string) => 
    [...accountsKeys.details(), workspaceId, accountId] as const,
  members: (workspaceId: string) => ['workspace-members', workspaceId] as const,
}

// Hook para listar contas bancárias
export function useAccountsListQuery(workspaceId: string) {
  return useQuery({
    queryKey: accountsKeys.list(workspaceId),
    queryFn: () => accountsApi.list(workspaceId),
    enabled: !!workspaceId,
  })
}

// Hook para obter uma conta específica
export function useAccountQuery(workspaceId: string, accountId?: string) {
  return useQuery({
    queryKey: accountsKeys.detail(workspaceId, accountId || ''),
    queryFn: () => {
      if (!accountId) throw new Error('Account ID is required')
      return accountsApi.getById(workspaceId, accountId)
    },
    enabled: !!workspaceId && !!accountId,
  })
}

// Hook para listar membros do workspace
export function useWorkspaceMembersQuery(workspaceId: string) {
  return useQuery({
    queryKey: accountsKeys.members(workspaceId),
    queryFn: () => accountsApi.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  })
}

// Hook para criar conta bancária
export function useCreateAccountMutation(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBankAccountRequest) =>
      accountsApi.create(workspaceId, data),
    onSuccess: () => {
      // Invalidar cache das contas para recarregar a lista
      queryClient.invalidateQueries({
        queryKey: accountsKeys.list(workspaceId),
      })
    },
  })
}

// Hook para atualizar conta bancária
export function useUpdateAccountMutation(workspaceId: string, accountId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBankAccountRequest) =>
      accountsApi.update(workspaceId, accountId, data),
    onSuccess: (updatedAccount) => {
      // Atualizar cache da lista
      queryClient.invalidateQueries({
        queryKey: accountsKeys.list(workspaceId),
      })
      
      // Atualizar cache da conta específica
      queryClient.setQueryData(
        accountsKeys.detail(workspaceId, accountId),
        updatedAccount
      )
    },
  })
}

// Hook para deletar conta bancária
export function useDeleteAccountMutation(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (accountId: string) =>
      accountsApi.delete(workspaceId, accountId),
    onSuccess: () => {
      // Invalidar cache das contas para recarregar a lista
      queryClient.invalidateQueries({
        queryKey: accountsKeys.list(workspaceId),
      })
    },
  })
}