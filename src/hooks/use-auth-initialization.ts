import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { authService } from '@/services/auth'
import { workspaceService } from '@/services/workspace'
import { initializeAuth } from '@/store'
import type { RootState } from '@/store'

export function useAuthInitialization() {
    const dispatch = useDispatch()
    const isInitialized = useSelector((state: RootState) => state.auth.isInitialized)
    
    // Query para buscar dados do usuário atual se estiver autenticado
    const { data: userData, isLoading } = useQuery({
        queryKey: ['auth-me'],
        queryFn: async () => {
            // Verificar se tem token válido
            if (!authService.isAuthenticated()) {
                return null
            }
            
            try {
                // Extrair dados do usuário do JWT
                const tokenData = authService.decodeToken()
                if (!tokenData) return null
                
                // Recuperar workspace salvo localmente
                const savedWorkspace = workspaceService.getSelectedWorkspace()
                
                return {
                    user: {
                        id: tokenData.sub,
                        name: tokenData.name || 'Usuário',
                        email: tokenData.email,
                    },
                    workspace: savedWorkspace
                }
            } catch {
                // Token inválido, limpar dados
                authService.removeToken()
                workspaceService.removeSelectedWorkspace()
                return null
            }
        },
        enabled: !isInitialized, // Só executar se não foi inicializado ainda
        retry: false, // Não tentar novamente em caso de erro
        staleTime: 0, // Sempre buscar dados frescos na inicialização
    })

    useEffect(() => {
        if (!isInitialized && !isLoading) {
            // Inicializar o estado de auth baseado na resposta
            dispatch(initializeAuth({
                user: userData?.user || null,
                workspace: userData?.workspace || null
            }))
        }
    }, [dispatch, isInitialized, isLoading, userData])

    return {
        isInitialized,
        isLoading,
    }
}