import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ProtectedRoute, PublicRoute, WorkspaceProtectedRoute } from '@/components/guards/auth-guard'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { DashboardPage } from '@/pages/dashboard'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import WorkspaceSelectionPage from '@/pages/workspace-selection'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: '/auth',
        element: (
            <PublicRoute>
                <AuthLayout />
            </PublicRoute>
        ),
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
        ],
    },
    {
        path: '/workspace-selection',
        element: (
            <ProtectedRoute>
                <WorkspaceSelectionPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/',
        element: (
            <WorkspaceProtectedRoute>
                <DashboardLayout />
            </WorkspaceProtectedRoute>
        ),
        children: [
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
        ],
    },
])
