import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { ToastContainer } from 'react-toastify'


const HomePage = () => {
  return (
        <main className='flex justify-center items-center min-h-screen'>
          <Header />

          <Outlet />
          <ToastContainer />
        </main>
  )
}

export default HomePage