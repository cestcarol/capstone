import React, { useState, useEffect } from 'react';
import ReactFlow, { isNode } from 'react-flow-renderer';
import CustomNodeComponent from './CustomNodeComponent';
import ELK from 'elkjs';
//import { getBezierPath } from "react-flow-renderer"

const DEFAULT_WIDTH = 210
const DEFAULT_HEIGHT = 100

const elk = new ELK({
  defaultLayoutOptions: {
    'elk.algorithm': 'mrtree',
    'elk.direction': 'DOWN',
    'elk.spacing.nodeNode': '75',
    'elk.layered.spacing.nodeNodeBetweenLayers': '75'
  }
})

const createGraphLayout = async (elements) => {
  const nodes = []
  const edges = []

  elements.forEach((el) => {
    if (isNode(el)) {
      nodes.push({
        id: el.id,
        width: el.__rf?.width ?? DEFAULT_WIDTH,
        height: el.__rf?.height ?? DEFAULT_HEIGHT
      })
    } else {
      edges.push({
        id: el.id,
        target: el.target,
        source: el.source
      })
    }
  })

  const newGraph = await elk.layout({
    id: 'root',
    children: nodes,
    edges: edges
  })
  return elements.map((el) => {
    if (isNode(el)) {
      const node = newGraph?.children?.find((n) => n.id === el.id)
      if (node?.x && node?.y && node?.width && node?.height) {
        el.position = {
          x: node.x, //- node.width / 4  , //+ Math.random() / 1000,
          y: node.y  //- node.height / 2
        }
      }
    }
    return el
  })
}

const nodeTypes = {
	special: CustomNodeComponent,
};


const LayoutFlow = ({initialElements}) => {
  const [elements, setElements] = useState()

  useEffect(() => {
    createGraphLayout(initialElements)
      .then(els => setElements(els))
      .catch(err => console.error(err))
  }, [initialElements])

  return (
      <ReactFlow 
      style={{
        width: 700, height: 500,
              position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'red'
      }}
        elements={elements}
        nodeTypes={nodeTypes} />
  )
}

export default LayoutFlow;



/*
const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';
const initialElements = [
  {
      id: '2',
      type: 'special',
      position,
      width: 200, height: 70,
      data: { lable: 'node2', text: 'A custom node' },
  },
  {
      id: '3',
      type: 'special',
      position,
      width: 200, height: 70,
      data: { label: 'node3', text: 'Another custom node' },
  },
  {
      id: '4',
      type: 'special',
      position,
      width: 200, height: 70,
      data: { label: 'node4', text: 'Yet Another custom node' },
  },
  { id: 'e2-3', source: '2', target: '3', type: edgeType, animate: 'false' },
  { id: 'e2-4', source: '2', target: '4', type: edgeType, animate: 'false' }
]
*/