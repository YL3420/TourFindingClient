import React, { useEffect, useState, useRef } from 'react'
import cytoscape from 'cytoscape';
import { makeStyles } from '@mui/styles';
// import CytoscapeComponent from 'react-cytoscapejs';



const calcDistance = (x1, y1, x2, y2) => {

    return Math.sqrt((x1-x2)**2 + (y1-y2)**2).toFixed(3);
}



const useStyles = makeStyles(theme => ({
    graph: {
        height: 600,
        width: 400,
        border: '1px solid #ccc'
    }
}));



const GraphComponent = ({ cyRef, handleGraphSubmit }) => {

    // for instantiating after render
    const containerRef = useRef(null);
    // const cyRef = useRef(null);
    const nodeCnt = useRef(2);
    const firstSelectedNodeRef = useRef(null);
    const rootNode = useRef(null);

    const classes = useStyles();

    const [graphReady, setGraphReady] = useState(false);


    useEffect(() => {
        // let cy = cyRef.current;
        if(containerRef.current){
            cyRef.current = cytoscape({
                container: containerRef.current,
                elements: {
                    nodes: [
                        {data: {id: "1", label: "n1"}},
                        {data: {id: "2", label: "n2"}}
                    ],
                    edges: [
                        {data: {id: "1-2", label: "n1-2", source: "1", target: "2", distance: 
                                calcDistance(100, 100, 200, 100)
                        }}
                    ]
                },
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
                    },

                    // for higlighting nodes
                    {
                        selector: '.highlighted',
                        style: {
                            'border-width': 2,
                            'border-color': 'yellow',
                        //   'transition-duration': '0.3s'
                        }
                    }
                ],
                  
                ready: function(){
                    window.cy = this
                }
            });

            setGraphReady(true);

            cyRef.current.on('tap', 'node', (e) => {
                const curr = e.target;
                if(firstSelectedNodeRef.current == null){
                    firstSelectedNodeRef.current = curr;
                }else if (firstSelectedNodeRef.current == curr){
                    firstSelectedNodeRef.current = null;
                } else {
                    const src = firstSelectedNodeRef.current.id();
                    const dst = curr.id();
                    const eId = `${src}-${dst}`;

                    cyRef.current.add({
                        group: 'edges',
                        data: {id: eId, label: `e${eId}`, source:src, target:dst, 
                            distance: calcDistance(firstSelectedNodeRef.current.position().x, firstSelectedNodeRef.current.position().y, 
                            curr.position().x, curr.position().y)}
                    })
                    firstSelectedNodeRef.current = null;
                }

                // handles selecting root node

                if(rootNode.current == null){
                    rootNode.current = curr;
                    rootNode.current.toggleClass('highlighted');
                } else if(rootNode.current == curr){
                    rootNode.current.toggleClass('highlighted');
                    rootNode.current = null;
                } else {
                    rootNode.current.toggleClass('highlighted');
                    rootNode.current = curr;
                    rootNode.current.toggleClass('highlighted');
                }
            })

            cyRef.current.on('taphold', 'node', (e) => {
                firstSelectedNodeRef.current = null;

                const node = e.target;
                node.remove();
                // nodeCnt.current--;
            })

            cyRef.current.on('tap', (e) => {
                if(e.target == cy){
                    firstSelectedNodeRef.current = null;


                    cy.add({
                        group: 'nodes',
                        data: {id: nodeCnt.current+1, label: `n${nodeCnt.current+1}`},
                        position: {x: e.position.x, y: e.position.y}
                    })
                    nodeCnt.current++;
                }
            })
        }
    });



    return (<div>
                <button onClick={() => handleGraphSubmit(cyRef, rootNode, graphReady)}
                    className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200'>Submit Graph</button>
                <div ref={containerRef}
                className={classes.graph}></div>
            </div>    
    )
}

export default React.memo(GraphComponent)