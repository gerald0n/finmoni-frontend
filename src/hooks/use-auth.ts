import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authService } from '@/services/auth'
import type { SignUpRequest } from '@/types'

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