import Cookies from 'js-cookie'

import { API_CONFIG, STORAGE_KEYS } from '@/config/constants'
import type {
  ApiError,
  CreditCard,
  CreateCreditCardRequest,
  UpdateCreditCardRequest,
  WorkspaceMember,
} from '@/types'

class CreditCardsApiClass {
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

  async list(workspaceId: string): Promise<CreditCard[]> {
    return this.makeRequest<CreditCard[]>(
      `/workspaces/${workspaceId}/credit-cards`,
    )
  }

  async getById(workspaceId: string, cardId: string): Promise<CreditCard> {
    return this.makeRequest<CreditCard>(
      `/workspaces/${workspaceId}/credit-cards/${cardId}`,
    )
  }

  async create(
    workspaceId: string,
    data: CreateCreditCardRequest,
  ): Promise<CreditCard> {
    return this.makeRequest<CreditCard>(
      `/workspaces/${workspaceId}/credit-cards`,
      'POST',
      data,
    )
  }

  async update(
    workspaceId: string,
    cardId: string,
    data: UpdateCreditCardRequest,
  ): Promise<CreditCard> {
    return this.makeRequest<CreditCard>(
      `/workspaces/${workspaceId}/credit-cards/${cardId}`,
      'PATCH',
      data,
    )
  }

  async delete(workspaceId: string, cardId: string): Promise<void> {
    return this.makeRequest<void>(
      `/workspaces/${workspaceId}/credit-cards/${cardId}`,
      'DELETE',
    )
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.makeRequest<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/members`,
    )
  }
}

export const creditCardsApi = new CreditCardsApiClass()
