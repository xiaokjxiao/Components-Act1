import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import Magic8Ball from './Magic8Ball'
import App from './LandingPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Magic8Ball /> */}
    <App />
    
  </StrictMode>,
)
