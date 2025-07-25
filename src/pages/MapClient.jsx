import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { toast } from 'react-toastify'
import ReCAPTCHA from 'react-google-recaptcha';

import LocMarker from '../components/LocMarker'
import { MapboxSearchBox } from '@mapbox/search-js-web'

import TripList from '../components/TripList'

import 'mapbox-gl/dist/mapbox-gl.css'


const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY


const DEFAULT_MAP_BOUNDS = [
    [-76.51344, 42.43822], 
    [-76.45130, 42.46219]
]


const start = [-74.00655, 40.70985];


const getNodeIdentifier = (lng, lat) => {
    const str = `${lat.toFixed(8)},${lng.toFixed(8)}`;
    return btoa(str); // base64 encode
}


const MapClient = () => {
    const [verified, setVerified] = useState(false)

    const mapRef = useRef();
    const mapContainerRef = useRef();
    const [mapReady, setMapReady] = useState(false);

    const [pins, setPins] = useState([]);
    const [routes, setRoutes] = useState({});

    const [tspEdges, setTspEdges] = useState([]);
    const [orderedVisit, setOrderedVisit] = useState([])
    const [hoveredBoxLabel, setHoveredBoxLabel] = useState('')

    // console.log('component called')

    const deleteAllEdges = () => {
        const map = mapRef.current;
        if (!map) return;
      
        if (!map.isStyleLoaded()) {
            map.once('style.load', deleteAllEdges);
            return;
        }
      
        const layers = map.getStyle().layers;
        if (!layers) return;
      
        for (const layer of layers) {
            if (layer.id.startsWith('edge_') && map.getLayer(layer.id)) {
                map.removeLayer(layer.id);
                if (map.getSource(layer.id)) {
                    map.removeSource(layer.id);
                }
            }
        }
    }

    const handleTspRequest = async () => {
        const root = { label: getNodeIdentifier(pins[0][0], pins[0][1]) }
        const vertices = pins.map((pin) => ({label: getNodeIdentifier(pin[0], pin[1]) }))
        const edges = Object.values(routes).map(route => ({
            weight: route.weight,
            v1: route.v1,
            v2: route.v2
        }));

        const payload = {
            root: root,
            graph: {
                vertices,
                edges
            }
        }

        console.log(pins.length)
        toast.info('submitted');

        const apiUrl = 'https://tsp-api-yl3420.onrender.com/api/solve';


        setTimeout( async () => {
            try{
                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                console.log(payload)

                const data = await res.json();

                if(res.ok){
                    pollSolution(data.jobId);
                }
                else{
                    console.log('failed');
                    toast.error('failed');
                } 
            } catch (err){
                console.log('failed');
            } 
        }, 0)
    }


    const pollSolution = (jobId) => {
        const interval = setInterval(async () => {
            try{
                const res = await fetch(`https://tsp-api-yl3420.onrender.com/api/solution/${jobId}`);

                if (!res.ok) {
                    const errorText = await res.text();
                    // console.error('Polling error:', res.status, errorText);
                    toast.error(`Polling failed: ${res.status} + ${errorText}`);
                    clearInterval(interval);
                    return;
                }


                let data = await res.text();

                console.log(data);
                data = JSON.parse(data);
                console.log(data.tour_cost);

                setTspEdges(constructTspEdges(data))
                setOrderedVisit(data.vertex_traversal)

                clearInterval(interval)
                // setDisplaySolution(true);
            } catch (err) {
                console.log(err);
                toast.error(err);
            }
        }, 2000);

        const timeout = setTimeout(() => {
            clearInterval(interval);

        }, 10000);
    }

    const constructTspEdges = (data) => {
        return data.edge_traversal.map((e) => (
            routes[e.v1+e.v2].steps
        ))    
    }


    const handleAddRoute = async (start, end) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
    
        try{
            const res = await fetch(url)
            const json = await res.json()
            const data = json.routes[0]

            const v1_id = getNodeIdentifier(start[0], start[1])
            const v2_id = getNodeIdentifier(end[0], end[1])

            setRoutes((prev) => ({
                ...prev, 
                [v1_id + v2_id]: {
                    weight: data.distance,
                    v1: { label: v1_id },
                    v2: { label: v2_id },
                    steps: data.geometry
                }
            }))
        } catch(error){
            console.log('Error occured: ' + error)
        }
    }
    
    useEffect(() => {
        if(!verified) return

        mapRef.current = new mapboxgl.Map({
            accessToken: MAPBOX_ACCESS_TOKEN, 
            container: mapContainerRef.current,
            bounds: DEFAULT_MAP_BOUNDS,
            minZoom: 13,
            style: 'mapbox://styles/mapbox/streets-v12'
        })

        return () => {
            mapRef.current.remove()
        }
    }, [verified])

    useEffect(() => {
        if(!mapRef.current) return

        mapRef.current.on('load', () => {
            setMapReady(true);

            const searchBox = new MapboxSearchBox()
            searchBox.accessToken = MAPBOX_ACCESS_TOKEN
            searchBox.marker = true
            searchBox.mapboxgl = mapboxgl
            searchBox.componentOptions = { allowReverse: true, flipCoordinates: true }
            mapRef.current.addControl(searchBox)
        })

        mapRef.current.on('click', async (e) => {
            console.log('event listener callled')
            const pin = [e.lngLat.lng, e.lngLat.lat]
            
            setPins((prev) => [...prev, pin])
        })
    }, [verified, mapRef])


    // handles the addition of pins
    useEffect(() => {
        if(!mapRef.current) return

        console.log('useEffect called')
        if (pins.length < 2) return;
        console.log('useEffect check called')
        for(let i=0; i<pins.length-1; i++){
            console.log('loop called')
            handleAddRoute(pins[i], pins[pins.length-1])
        }
    }, [pins])


    // add routes for traveling salesman
    useEffect(() => {
        if(!mapRef.current) return

        deleteAllEdges()
        for(let i=0; i<tspEdges.length; i++){
            const geojson = {
                'type': 'Feature',
                'properties': {},
                'geometry': tspEdges[i]
            }

            mapRef.current.addLayer({
                id: `edge_${i}`,
                type: 'line',
                source: {
                  type: 'geojson',
                  data: geojson
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': '#3887be',
                  'line-width': 5,
                  'line-opacity': 0.75
                }
            })
        }
    }, [tspEdges])
    

    const handleRecaptcha = (token) => {
        if(token) setVerified(true)
    }

    if (!verified) {
        console.log('RECAPTCHA_SITE_KEY:', RECAPTCHA_SITE_KEY);
    }

    return (
        <div className='relative w-full flex justify-center'>

            {/* application box of map */}
            <div className='border border-gray-300 rounded-xl w-[800px] p-4 flex flex-col'>
                {
                    !verified ? (
                        <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptcha} />
                    ) :
                    (
                        <>
                            <div className="flex flex-row gap-16 px-4">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Controls</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Add Marker/Stop: Click on location on map</li>
                                        <li>Camera movement: panning</li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Notes</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Marker must be reachable from a pedastrian route</li>
                                        <li>This map currently supports one mode of travel: walking</li>
                                        <li>First selected marker is the starting location for the trip</li>
                                        <li>TSP currently does not enforce order of visits, it plans routes solely on minimized total distance</li>
                                    </ul>
                                </div>
                            </div>

                            <div className='px-6 py-3'>

                            <div className="flex flex-row gap-4">
                                <button onClick={() => handleTspRequest()}
                                        className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200'>Submit Graph</button>

                                <button onClick={() => {
                                        setPins([])
                                        setOrderedVisit([])
                                        setRoutes({})
                                        deleteAllEdges()
                                        toast.info('cleared')
                                    }}
                                        className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200'>Clear</button>
                            </div>

                            <div className='w-[600] h-[450px]'>
                                <div id='map-container' className='w-full h-full' ref={mapContainerRef} />
                            </div>

                            {
                                (pins.length > 0 && mapRef) && pins.map((coordinates, i) => (
                                    <LocMarker key={i} map={mapRef.current} coordinates={coordinates} label={getNodeIdentifier(coordinates[0], coordinates[1])} hoverBoxLabel={hoveredBoxLabel} />
                                ))
                            }


                            </div>
                        </>
                    )
                }
            </div>
            

            <div className="absolute top-4" style={{ left: 'calc(800px + (100% - 800px) / 2)' }}>
                <TripList 
                    tspOrderedVisits={orderedVisit}
                    hoveredBoxLabel={hoveredBoxLabel}
                    setHoveredBoxLabel={setHoveredBoxLabel} />
            </div>

        </div>
    )
}

export default MapClient