import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GeistProvider } from '@geist-ui/core'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GeistProvider>
      <App />
    </GeistProvider>
  </StrictMode>,
)
