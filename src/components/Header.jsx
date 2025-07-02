import React from 'react'

const Header = () => {
  return (
    <div className="w-full flex justify-end items-center px-4 py-2 fixed top-0 left-0 z-50 pointer-events-none">
        {/* <a
            href="https://github.com/YOUR_USERNAME/YOUR_REPO"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
        > */}
            {/* <img src="/path/to/github.svg" alt="GitHub" className="w-5 h-5" /> */}
            Bug? 
            <span className="underline">
                <a href='https://github.com/YL3420/TravelingSalesmanAPI/issues'
                className='flex items-center gap-2 text-base font-semibold text-black bg-white/80 px-4 py-2 rounded-lg shadow pointer-events-auto hover:bg-white hover:shadow-md transition'
                >Github</a>
            </span>
        {/* </a> */}
</div>
  )
}

export default Header