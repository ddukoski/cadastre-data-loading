import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GeistProvider, CssBaseline } from './lib/geist'
import { theme } from './lib/theme'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GeistProvider themes={[theme]} themeType={theme.type}>
      <CssBaseline />
      <App />
    </GeistProvider>
  </StrictMode>,
)
