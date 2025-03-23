import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import './App.css'
import AuthPage from './pages/AuthPage'
import FarmerDashboard from './components/FarmerDashboard'

function App() {

  return (
    <>
      <Routes>
        <Route path='/auth' element={<AuthPage/>}></Route>
        <Route path='/dashboard' element={<FarmerDashboard/>}></Route>
      </Routes>
    </>
  )
}

export default App
