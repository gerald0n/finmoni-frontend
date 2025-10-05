import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import { LoadingSpinner } from '@/components/ui/loading'
import { useAuthInitialization } from '@/hooks/use-auth-initialization'
import { queryClient } from '@/lib/query-client'
import { router } from '@/router'
import { authService } from '@/services/auth'
import { store } from '@/store'

function AppContent() {
  const { isInitialized, isLoading } = useAuthInitialization()

  // Mostrar loading enquanto inicializa a autenticação
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <RouterProvider router={router} />
}

function App() {
  useEffect(() => {
    authService.migrateTokenFromLocalStorage()
  }, [])

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  )
}

export default App
