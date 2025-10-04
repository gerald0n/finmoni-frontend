import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from '@/lib/query-client'
import { router } from '@/router'
import { authService } from '@/services/auth'
import { store } from '@/store'

function App() {
  useEffect(() => {
    authService.migrateTokenFromLocalStorage()
  }, [])

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  )
}

export default App
