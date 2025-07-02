import React from 'react'
import GraphTab from '../components/GraphTab'
import Header from '../components/Header'



const HomePage = () => {
  return (
        <main className='flex justify-center items-center min-h-screen'>
            <Header />
            <GraphTab />
        </main>
  )
}

export default HomePage