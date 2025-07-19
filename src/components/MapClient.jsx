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
    const mapContainerRef = useRef();

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            accessToken: MAPBOX_ACCESS_TOKEN, 
            container: mapContainerRef.current,
            bounds: DEFAULT_MAP_BOUNDS,
            minZoom: 13,
        })

        return () => {
            mapRef.current.remove()
        }

    }, [])
    

    return (
        <div className='border border-gray-300 rounded-xl w-[800px] p-4 flex flex-col'>
            <div className="flex flex-row gap-16 px-4">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Controls</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Add Node: Click empty space on canvas</li>
                        <li>Delete Node: Hold on an existing node until it disappears</li>
                        <li>Make Connection: Click source node, then target node</li>
                        <li>Select Root Node: Toggle node until yellow border appears</li>
                        <li>Camera movement: panning</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Constraints</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>All nodes must be reachable from the root</li>
                        <li>No duplicate edges between same nodes</li>
                        <li>Every two distinct nodes must be connected by an edge</li>
                        <li>Root must be selected before submitting</li>
                    </ul>
                </div>
            </div>
            <div className='px-6 py-3'>
                <div className='w-[400px] h-[450px]'>
                    <div id='map-container' className='w-full h-full' ref={mapContainerRef} />
                </div>
            </div>
        </div>
    )
}

export default MapClient