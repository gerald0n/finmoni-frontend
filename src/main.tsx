import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/styles/globals.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Performance monitoring
if (import.meta.env.PROD && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('FinMoni App initialized')
}
