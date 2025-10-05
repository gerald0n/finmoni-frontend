import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { authService } from '@/services/auth'
import { workspaceService } from '@/services/workspace'
import { login as loginAction, logout as logoutAction } from '@/store'
import type { LoginRequest, SignUpRequest } from '@/types'

export function useLogin() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: (data, variables) => {
            try {
                authService.saveToken(data.accessToken)
                
                // Extrair dados reais do JWT
                const tokenData = authService.decodeToken()
                dispatch(loginAction({
                    id: tokenData?.sub || 'unknown-id',
                    name: tokenData?.name || 'Usuário',
                    email: tokenData?.email || variables.email,
                }))

                // Sempre direcionar para workspace selection após login
                navigate('/workspace-selection', { replace: true })
            } catch {
                throw new Error('Erro interno. Tente novamente.')
            }
        },
    })
}

export function useSignUp() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (userData: SignUpRequest) => authService.signUp(userData),
        onSuccess: () => {
            navigate('/auth/login', {
                replace: true,
                state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
            })
        },

    })
}

export function useLogout() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return useCallback(() => {
        authService.removeToken()
        workspaceService.removeSelectedWorkspace()
        dispatch(logoutAction())
        navigate('/auth/login', { replace: true })
    }, [navigate, dispatch])
}