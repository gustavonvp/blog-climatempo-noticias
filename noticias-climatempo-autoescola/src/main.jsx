import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import App2 from './App2'
import App3 from './App3'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    </StrictMode>

)

createRoot(document.getElementById('root2')).render(
    <StrictMode>
        <App2 />
    </StrictMode>

)

createRoot(document.getElementById('root3')).render(
    <StrictMode>
        <App3 />
    </StrictMode>

)