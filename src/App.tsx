import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'

import { queryClient } from '@/lib/query-client'
import { store } from '@/store'

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient} />
    </Provider>
  )
}

export default App
