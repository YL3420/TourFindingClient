import React, { useRef, useEffect, useState } from 'react'
import GraphComponent from './GraphComponent'
import GraphSolutionComponent from './GraphSolutionComponent';



const GraphTab = () => {
    const cyRef = useRef(null);
    const [displaySolution, setDisplaySolution] = useState(false);
    const [allNodes, setAllNodes] = useState(null);
    const [allEdges, setAllEdges] = useState(null);
    const [data, setData] = useState(null);



    const handleGraphSubmit = async (cyRef, rootRef, graphReady) => {
        const cy = cyRef.current;
        const rootN = rootRef.current;
        if(graphReady == false) return;

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


        // pins the server because of the stupid inactivity shutdown on Render
        const pin = await fetch('/api')

        const apiUrl = '/api/solve';
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
            else console.log('failed');
        } catch (err){
            console.log('failed');
        }

    }

    const pollSolution = (jobId) => {
        const interval = setInterval(async () => {
            try{
                const res = await fetch(`/api/solution/${jobId}`);
                let data = await res.text();

                console.log(data);
                data = JSON.parse(data);
                console.log(data.tour_cost);

                setAllNodes(constructAllNodes())
                setAllEdges(constructAllEdges(data))

                console.log(constructAllNodes)
                setData(data);
                // setDisplaySolution(true);
            } catch (err) {
                console.log(err);
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
        <div className='flex flex-row'>
            <div>
                <GraphComponent cyRef={cyRef} handleGraphSubmit={handleGraphSubmit} />
            </div>
            <div>
                {  data ? 
                <GraphSolutionComponent allEdges={allEdges} allNodes={allNodes}  />: <></>
                }
            </div>
        </div>
    )
}

export default GraphTab