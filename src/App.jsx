import { useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import './index.css'

import HomePage from './pages/HomePage'
import AppSection from './layouts/AppSection'
import GraphPage from './pages/GraphPage'
import MapClient from './pages/MapClient'


function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* <Route path='/' element={<HomePage />} />
        <Route  path='/' element={<AppSection />}>
          <Route element={<GraphPage />} />
        </Route> */}

        <Route path='/' element={<HomePage />}>
          <Route element={<AppSection />}>
            <Route path='/' element={<GraphPage />} />
            <Route path='/map' element={<MapClient />} />
          </Route>
        </Route>
      </>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
