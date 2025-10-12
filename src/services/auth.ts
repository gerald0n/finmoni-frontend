import Cookies from 'js-cookie'

import { API_CONFIG, COOKIE_CONFIG, STORAGE_KEYS } from '@/config/constants'
import type {
  ApiError,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/types'

class AuthServiceClass {
  private async makeRequest<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(
        Array.isArray(error.message) ? error.message[0] : error.message,
      )
    }

    return response.json()
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>(
      API_CONFIG.ENDPOINTS.SIGN_IN,
      credentials,
    )
  }

  async signUp(userData: SignUpRequest): Promise<SignUpResponse> {
    return this.makeRequest<SignUpResponse>(
      API_CONFIG.ENDPOINTS.SIGN_UP,
      userData,
    )
  }

  saveToken(token: string): void {
    Cookies.set(STORAGE_KEYS.AUTH_TOKEN, token, {
      expires: COOKIE_CONFIG.EXPIRES_DAYS,
      path: COOKIE_CONFIG.PATH,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      secure: window.location.protocol === 'https:',
    })
  }

  getToken(): string | null {
    return Cookies.get(STORAGE_KEYS.AUTH_TOKEN) || null
  }

  removeToken(): void {
    Cookies.remove(STORAGE_KEYS.AUTH_TOKEN, { path: COOKIE_CONFIG.PATH })
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Decodificar JWT para extrair dados do usuário
  decodeToken(): { sub: string; email: string; name?: string } | null {
    const token = this.getToken()
    if (!token) return null

    try {
      // Decodificar JWT (assumindo formato padrão)
      const parts = token.split('.')
      if (parts.length !== 3 || !parts[1]) return null

      const payload = JSON.parse(atob(parts[1]))

      // Extrair nome real do usuário do payload
      const fullName =
        payload.name ||
        payload.displayName ||
        payload.given_name ||
        payload.username
      const firstName = fullName ? fullName.split(' ')[0] : 'Usuário'

      return {
        sub: payload.sub || payload.userId || payload.id,
        email: payload.email || payload.username || payload.email,
        name: firstName,
      }
    } catch {
      return null
    }
  }
}

export const authService = new AuthServiceClass()
