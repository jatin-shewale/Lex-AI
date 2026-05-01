import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: { primary: '#0ea5e9', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#ffffff' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
