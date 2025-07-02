import React, { useEffect, useState, useRef } from 'react'
import cytoscape from 'cytoscape';
import { makeStyles } from '@mui/styles';



const useStyles = makeStyles(theme => ({
    graph: {
        height: 600,
        width: 400,
        border: '1px solid #ccc'
    }
}));

const GraphSolutionComponent = ({ allEdges, allNodes }) => {
    const containerRef = useRef(null);
    const cyRef = useRef(null);
    const classes = useStyles();


    useEffect(() => {
        if(containerRef.current){
            cyRef.current = cytoscape({
                container: containerRef.current,
                elements: [...allNodes, ...allEdges],
                layout: { name: 'preset' },
                panningEnabled:false,
                boxSelectionEnabled:false,
                style: [
                    {
                        selector: 'node',
                        style: {
                          label: 'data(label)',          // <-- enables label view
                          'text-valign': 'center',
                          'text-halign': 'center',
                          'color': '#000',               // label text color
                          'font-size': 14,
                          // 'background-color': '#0074D9',
                          // 'text-outline-color': '#fff',
                          // 'text-outline-width': 2
                        }
                      },
                      {
                          selector: 'edge',
                          style: {
                            label: 'data(distance)',
                            'text-rotation': 'autorotate',
                          //   'text-margin-y': -10,
                            'color': '#FFFFFF',
                            'font-size': 20
                          }
                      }
                ]
            })
        }
    })


    return (
        <div>
            {/* { nodes.length } */}
            <div ref={containerRef}
                className={classes.graph}></div>
        </div>
    )
}

export default GraphSolutionComponent