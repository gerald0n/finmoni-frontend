import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { authService } from '@/services/auth'
import { login as loginAction, logout as logoutAction } from '@/store'
import type { LoginRequest, SignUpRequest } from '@/types'

export function useLogin() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: (data, variables) => {
            try {
                authService.saveToken(data.accessToken)
                dispatch(loginAction({
                    id: 'temp-id',
                    name: 'Usuário',
                    email: variables.email,
                }))

                const from = location.state?.from?.pathname || '/dashboard'
                navigate(from, { replace: true })
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
        dispatch(logoutAction())
        navigate('/auth/login', { replace: true })
    }, [navigate, dispatch])
}