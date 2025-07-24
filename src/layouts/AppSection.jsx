import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'


// the template for different apps, with tab styling and UI
const AppSection = () => {
const location = useLocation();
const currentPath = location.pathname;

  return (
    <section>

      <div className='mt-3 relative'>
        <div class='flex ml-4'>

          <div
            className={`text-sm px-6 py-2 border border-b-0 shadow-sm font-medium relative ${
              currentPath === '/' 
                ? 'bg-white text-gray-800 z-20' 
                : 'bg-gray-200 text-gray-500 z-10'
            }`}
            style={{
                clipPath: 'polygon(0% 100%, 10% 0%, 90% 0%, 100% 100%)',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                width: 'fit-content'
            }}
            >
              <Link to='/'>Nodes</Link>
          </div>

          <div
            className={`text-sm px-6 py-2 border border-b-0 shadow-sm font-medium relative -ml-2 ${
              currentPath === '/map' 
                ? 'bg-white text-gray-800 z-20' 
                : 'bg-gray-200 text-gray-500 z-10'
            }`}
            style={{
                clipPath: 'polygon(0% 100%, 10% 0%, 90% 0%, 100% 100%)',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                width: 'fit-content'
            }}
            >
              <Link to='/map'> Map </Link>
          </div>
        
        </div>
      </div>

        <Outlet />
    </section>
  )
}

export default AppSection