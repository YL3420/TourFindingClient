import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'


const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;


const DEFAULT_MAP_BOUNDS = [
    [-74.03189, 40.69684],
    [-73.98121, 40.72286]
]




const MapClient = () => {
    const mapRef = useRef();
    

    return (
        <div>MapClient</div>
    )
}

export default MapClient