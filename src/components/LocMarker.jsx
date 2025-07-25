import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'


const MarkerSVG = () => (
    <svg className='w-full h-full' viewBox="0 0 88 106" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_2001_2)">
            <path d="M84.5254 40.7407C84.5254 63.2412 54.0169 100 43.8475 100C32.7535 100 3.16949 63.2412 3.16949 40.7407C3.16949 18.2403 21.3816 0 43.8475 0C66.3133 0 84.5254 18.2403 84.5254 40.7407Z" fill="#43538D" />
        </g>
        <circle cx="43.8983" cy="40.8983" r="33.8983" fill="" />
        <defs>
            <filter id="filter0_d_2001_2" x="0.169495" y="0" width="87.3559" height="106" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="1.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2001_2" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2001_2" result="shape" />
            </filter>
        </defs>
    </svg>
)


const LocMarker = ({ map, coordinates, label, hoverBoxLabel }) => {
    const markerRef = useRef(null);
    const markerContentRef = useRef(document.createElement('div'));

    // markerContentRef.current.className = 'w-[32px] h-[40px]'

    // manages enlargement of marker
    useEffect(() => {
        if(!map) return

        const container = markerContentRef.current
        const isHoveredOver = label === hoverBoxLabel

        const initW = 32
        const initH = 40

        container.style.width = isHoveredOver ? `${initW * 1.2}px` : `${initW}px`
        container.style.height = isHoveredOver ? `${initH * 1.2}px` : `${initH}px`

    }, [map, hoverBoxLabel])


    useEffect(() => {
        markerRef.current = new mapboxgl.Marker(markerContentRef.current, {
            anchor: 'bottom'
        })
            .setLngLat(coordinates)
            .addTo(map);
        
        return () => {
            markerRef.current.remove()
        }
    }, [])
    

    return (

        <>
            {
                createPortal(
                    <>
                        <MarkerSVG />
                        <div className="marker-emoji">📍</div>
                    </>,
                    markerContentRef.current
                )
            }
        </>
    )
}

export default LocMarker