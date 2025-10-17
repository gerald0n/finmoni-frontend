import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ProtectedRoute, PublicRoute, WorkspaceProtectedRoute } from '@/components/guards/auth-guard'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { LoadingSpinner } from '@/components/ui/loading'

// Lazy loading das páginas para otimização de performance
const DashboardPage = lazy(() => import('@/pages/dashboard').then(module => ({ default: module.DashboardPage })))
const BankAccountsPage = lazy(() => import('@/pages/bank-accounts').then(module => ({ default: module.BankAccountsPage })))
const CreditCardsPage = lazy(() => import('@/pages/credit-cards').then(module => ({ default: module.CreditCardsPage })))
const LoginPage = lazy(() => import('@/pages/login').then(module => ({ default: module.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/register').then(module => ({ default: module.RegisterPage })))
const WorkspaceSelectionPage = lazy(() => import('@/pages/workspace-selection'))

// Componente de loading para Suspense
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
    </div>
)

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
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <LoginPage />
                    </Suspense>
                ),
            },
            {
                path: 'register',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <RegisterPage />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '/workspace-selection',
        element: (
            <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                    <WorkspaceSelectionPage />
                </Suspense>
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
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <DashboardPage />
                    </Suspense>
                ),
            },
            {
                path: 'bank-accounts',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <BankAccountsPage />
                    </Suspense>
                ),
            },
            {
                path: 'credit-cards',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <CreditCardsPage />
                    </Suspense>
                ),
            },
        ],
    },
])
