import React, { useRef, useEffect } from 'react'
import GraphComponent from './GraphComponent'



const GraphTab = () => {
    const cyRef = useRef(null);


    const submitGraph = async () => {
        const cy = cyRef.current;
        if(!cy){
            console.log("hi")
            return
        }

        console.log(cy)
    }


    return (
        <div>
            <button onClick={submitGraph}>button</button>
            <GraphComponent cyRef={cyRef} />
        </div>
    )
}

export default GraphTab