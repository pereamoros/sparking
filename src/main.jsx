import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react"

ReactDOM.createRoot(document.querySelector('main')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
