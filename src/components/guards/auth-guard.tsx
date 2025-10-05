import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { authService } from '@/services/auth'
import { workspaceService } from '@/services/workspace'
import type { RootState } from '@/store'

interface ProtectedRouteProps {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation()
    const user = useSelector((state: RootState) => state.auth.user)
    const isAuthenticated = authService.isAuthenticated()

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
    const user = useSelector((state: RootState) => state.auth.user)
    const selectedWorkspace = useSelector((state: RootState) => state.auth.selectedWorkspace)
    const isAuthenticated = authService.isAuthenticated()

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
    const user = useSelector((state: RootState) => state.auth.user)
    const isAuthenticated = authService.isAuthenticated()

    if (isAuthenticated && user) {
        return <Navigate to="/workspace-selection" replace />
    }

    return <>{children}</>
}