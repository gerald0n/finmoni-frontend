import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { LoadingSpinner } from '@/components/ui/loading'
import { authService } from '@/services/auth'
import { workspaceService } from '@/services/workspace'
import type { RootState } from '@/store'

interface ProtectedRouteProps {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation()
    const { user, isInitialized } = useSelector((state: RootState) => state.auth)
    const isAuthenticated = authService.isAuthenticated()

    // Se ainda não inicializou, mostrar loading
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}

interface WorkspaceProtectedRouteProps {
    children: ReactNode
}

export function WorkspaceProtectedRoute({ children }: WorkspaceProtectedRouteProps) {
    const location = useLocation()
    const { user, selectedWorkspace, isInitialized } = useSelector((state: RootState) => state.auth)
    const isAuthenticated = authService.isAuthenticated()

    // Se ainda não inicializou, mostrar loading
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

    if (!selectedWorkspace && !workspaceService.hasSelectedWorkspace()) {
        return <Navigate to="/workspace-selection" replace />
    }

    return <>{children}</>
}

interface PublicRouteProps {
    children: ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
    const { user, isInitialized } = useSelector((state: RootState) => state.auth)
    const isAuthenticated = authService.isAuthenticated()

    // Se ainda não inicializou, mostrar loading
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (isAuthenticated && user) {
        return <Navigate to="/workspace-selection" replace />
    }

    return <>{children}</>
}