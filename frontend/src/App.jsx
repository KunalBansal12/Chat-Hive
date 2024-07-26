import { createContext, useContext, useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import toast, {Toaster} from 'react-hot-toast'

const socketContext=createContext(0);

export const usesocket=()=>useContext(socketContext);

function App() {
  const [socketConn, setSocketConn] = useState(null)

  return (
    <>
    <socketContext.Provider value={{socketConn, setSocketConn}}>
      <Toaster/>
      <Outlet />
    </socketContext.Provider>
    </>
  )
}

export default App