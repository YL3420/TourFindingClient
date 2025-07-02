import React, { useRef, useEffect, useState, useCallback } from 'react'
import GraphComponent from './GraphComponent'
import GraphSolutionComponent from './GraphSolutionComponent';
import Spinner from './Spinner';
import { toast } from 'react-toastify';



const GraphTab = () => {
    const cyRef = useRef(null);
    const [displaySolution, setDisplaySolution] = useState(false);
    const [allNodes, setAllNodes] = useState(null);
    const [allEdges, setAllEdges] = useState(null);
    const [data, setData] = useState(null);
    const [submitted, setSubmitted] = useState(false);



    const handleGraphSubmit = useCallback(async (cyRef, rootRef, graphReady) => {
        const cy = cyRef.current;
        const rootN = rootRef.current;
        if(graphReady == false) return;
        if(!rootN){ toast.error('no root selected'); return; }

        const vertices = cy.nodes().map(n => ({
            label: n.id(),
            coord_x: n.position().x,
            coord_y: n.position().y
        }));

        const edges = cy.edges().map(e => ({
            weight: e.data('distance'),
            v1: {label: e.source().id(), coord_x: e.sourceEndpoint().x, coord_y: e.sourceEndpoint().y},
            v2: {label: e.target().id(), coord_x: e.targetEndpoint().x, coord_y: e.targetEndpoint().y}
        }));

        const root = {
            label: rootN.id(),
            coord_x: rootN.position().x,
            coord_y: rootN.position().y
        }

        const payload = {
            root: root,
            graph: {
                vertices,
                edges
            }
        }



        
        setSubmitted(true);
        setData(null);

        toast.info('submitted');

        const apiUrl = 'https://tsp-api-yl3420.onrender.com/api/solve';

        // pins the server because of the stupid inactivity shutdown on Render
        const pin = await fetch('https://tsp-api-yl3420.onrender.com/api/solution/1')

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
    }, [])



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

                setAllNodes(constructAllNodes())
                setAllEdges(constructAllEdges(data))

                console.log(constructAllNodes)
                setData(data);

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


    const constructAllNodes = () => {
        return cyRef.current.nodes().map(n => ({
            data: {
                id: n.id(),
                label: n.data('label')
            },
            position: n.position()
        }))
    }

    const constructAllEdges = (data) => {
        return data.edge_traversal.map(e => ({
            data: {
                id: `${e.v1}-${e.v2}`,
                label: `${e.v1}-${e.v2}`,
                source: e.v1,
                target: e.v2,
                distance: e.weight
            }
        }))
    }


    return (
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
            
            <div className='border-gray-300 rounded-xl border px-6 py-4'>
                <div className="px-6 flex flex-row gap-16">
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
                    <div className='flex flex-row gap-5'>
                        <div>
                            <GraphComponent cyRef={cyRef} handleGraphSubmit={handleGraphSubmit} />
                        </div>
                        <div>

                            { data && submitted &&
                                <GraphSolutionComponent allEdges={allEdges} allNodes={allNodes}  />
                            }

                            {
                                !data && submitted &&
                                <Spinner loading={true} />
                            }

                            {
                                !data && !submitted &&
                                <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GraphTab