export interface User {
    id: string
    name: string
    email: string
    createdAt?: string
    updatedAt?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface SignUpRequest {
    name: string
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
}

export type SignUpResponse = User

export interface ApiError {
    statusCode: number
    message: string | string[]
    error: string
}

export type Theme = 'light' | 'dark' | 'system'