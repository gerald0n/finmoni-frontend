import Cookies from 'js-cookie'

import { API_CONFIG, STORAGE_KEYS } from '@/config/constants'
import type {
  ApiError,
  BankAccount,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
  WorkspaceMember,
} from '@/types'

class AccountsApiClass {
  private getAuthHeaders() {
    const token = Cookies.get(STORAGE_KEYS.AUTH_TOKEN)
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    data?: unknown,
  ): Promise<T> {
    const requestInit: RequestInit = {
      method,
      headers: this.getAuthHeaders(),
    }

    if (data) {
      requestInit.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, requestInit)

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(
        Array.isArray(error.message) ? error.message[0] : error.message,
      )
    }

    // Para DELETE que retorna 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // Listar contas bancárias do workspace
  async list(workspaceId: string): Promise<BankAccount[]> {
    return this.makeRequest<BankAccount[]>(
      `/workspaces/${workspaceId}/accounts`,
    )
  }

  // Obter detalhes de uma conta bancária
  async getById(workspaceId: string, accountId: string): Promise<BankAccount> {
    return this.makeRequest<BankAccount>(
      `/workspaces/${workspaceId}/accounts/${accountId}`,
    )
  }

  // Criar nova conta bancária
  async create(
    workspaceId: string,
    data: CreateBankAccountRequest,
  ): Promise<BankAccount> {
    return this.makeRequest<BankAccount>(
      `/workspaces/${workspaceId}/accounts`,
      'POST',
      data,
    )
  }

  // Atualizar conta bancária
  async update(
    workspaceId: string,
    accountId: string,
    data: UpdateBankAccountRequest,
  ): Promise<BankAccount> {
    return this.makeRequest<BankAccount>(
      `/workspaces/${workspaceId}/accounts/${accountId}`,
      'PATCH',
      data,
    )
  }

  // Deletar conta bancária
  async delete(workspaceId: string, accountId: string): Promise<void> {
    return this.makeRequest<void>(
      `/workspaces/${workspaceId}/accounts/${accountId}`,
      'DELETE',
    )
  }

  // Listar membros do workspace (para popular o select de proprietários)
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.makeRequest<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/members`,
    )
  }
}

export const accountsApi = new AccountsApiClass()