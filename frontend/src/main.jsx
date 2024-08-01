import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.jsx'
import { RecoilRoot } from 'recoil'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RecoilRoot>
    <RouterProvider router={router}>
      <App /> 
    </RouterProvider>
    </RecoilRoot>
  // </React.StrictMode>,
)