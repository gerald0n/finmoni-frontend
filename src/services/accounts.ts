import Cookies from 'js-cookie'

import { API_CONFIG, STORAGE_KEYS } from '@/config/constants'
import type {
  ApiError,
  BankAccount,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
  WorkspaceMember,
} from '@/types'

class AccountsServiceClass {
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

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  async list(workspaceId: string): Promise<BankAccount[]> {
    return this.makeRequest<BankAccount[]>(
      `/workspaces/${workspaceId}/accounts`,
    )
  }

  async getById(workspaceId: string, accountId: string): Promise<BankAccount> {
    return this.makeRequest<BankAccount>(
      `/workspaces/${workspaceId}/accounts/${accountId}`,
    )
  }

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

  async delete(workspaceId: string, accountId: string): Promise<void> {
    return this.makeRequest<void>(
      `/workspaces/${workspaceId}/accounts/${accountId}`,
      'DELETE',
    )
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.makeRequest<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/members`,
    )
  }

  static centsToCurrency(cents?: number): string {
    if (cents === null || cents === undefined) return '0,00'
    return (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  static currencyToCents(value: string): number {
    const normalized = value.trim().replace(',', '.')
    const numberValue = parseFloat(normalized)
    if (isNaN(numberValue)) return 0
    return Math.round(numberValue * 100)
  }
}

export const AccountsService = new AccountsServiceClass()