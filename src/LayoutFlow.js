import
    //React,
     { useState, useEffect
    //useCallback, useAsync, Component
 } from 'react';
import ReactFlow, { isNode, Controls } from 'react-flow-renderer';
import CustomNodeComponent from './CustomNodeComponent';
import ELK from 'elkjs';


const DEFAULT_WIDTH = 310
const DEFAULT_HEIGHT = 130

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
          x: node.x + node.width,
          y: node.y
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

  //automatic center when loading this component ?
  /*const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();

}*/
//const onLoad=(reactFlowInstance) => setTimeout(() => reactFlowInstance.fitView(),0  )

  return (
      <ReactFlow
      style={{
        width: 1000, height: 600,
        position: 'absolute', left: '60%', top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#DCDCDC',
        border: '1px solid black'
      }}
        elements={elements}
        nodeTypes={nodeTypes}
        //onLoad={onLoad}
        //fitViewOnInit
        >
        <Controls />
      </ReactFlow>
  )
}

export default LayoutFlow;
