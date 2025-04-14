import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import './App.css'
import AuthPage from './pages/farmer/AuthPage'
import HomePage from './components/Farmer/home/home'
import FarmerDashboard from './components/Farmer/Dashboard/FarmerDashboard'

function App() {

  return (
    <>
      <Routes>
        <Route path='/auth' element={<AuthPage/>}></Route>
        <Route path='/dashboard' element={<FarmerDashboard/>}></Route>
        <Route path='/' element={<HomePage/>}></Route>
      </Routes>
    </>
  )
}

export default App
