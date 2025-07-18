import React from 'react'
import { Outlet } from 'react-router-dom'


// the template for different apps, with tab styling and UI
const AppSection = () => {
  return (
    <section>
        <div className='mt-3'>
        <div
            className="bg-white text-sm text-gray-800 px-6 py-2 border border-gray-300 border-b-0 shadow-sm font-medium -mb-px z-10 ml-4"
            style={{
                clipPath: 'polygon(0% 100%, 10% 0%, 90% 0%, 100% 100%)',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                width: 'fit-content'
            }}
            >
                Nodes
            </div>
        </div>
        <Outlet />
    </section>
  )
}

export default AppSection