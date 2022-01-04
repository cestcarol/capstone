import { json } from 'd3';
import React, { useState, useEffect } from 'react';

import ReactFlow, { isEdge, getConnectedEdges, removeElements, getOutgoers, getIncomers, ReactFlowProvider, useStoreState, MiniMap } from 'react-flow-renderer';

import CustomNodeComponent from './CustomNodeComponent';
import { protoplan_to_graph } from './planparser';

//TODO voir elkjs for automatic layouting
const nodeTypes = {
	special: CustomNodeComponent,
};

const saved_plan = "ErQBErEBCiUKAj9zEgI/cBoCP28iF2h0dHA6Ly9leGFtcGxlLm9yZy90ZXN0GikKAj9wEiNodHRwOi8vcHVybC5vcmcvZ29vZHJlbGF0aW9ucy9wcmljZRoKCgI/bxIEIjM2IhowCgI/cxIqaHR0cDovL2RiLnV3YXRlcmxvby5jYS9+Z2FsdWMvd3NkYm0vT2ZmZXIxIgMyNDYqGjIwMjEtMTItMTdUMTU6MTg6NTAuNTE1OTIy";
const nope = "EkoSSAolCgI/cxICP3AaAj9vIhdodHRwOi8vZXhhbXBsZS5vcmcvdGVzdCIDNTAwKhoyMDIyLTAxLTA0VDE0OjQ3OjEyLjYxNjA3Mg==";
const other = "EpYFGpMFCpMCCiUKAj9vEgI/cBoCP3MiF2h0dHA6Ly9leGFtcGxlLm9yZy90ZXN0GicKAj9vEiFodHRwOi8vaGFydGgub3JnL2FuZHJlYXMvZm9hZiNiaW8aMgoCP3ASLGh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNzZWVBbHNvGmwKAj9zEmZodHRwOi8vcmRmLm9wZW5tb2xlY3VsZXMubmV0Lz9JbkNoST0xL0MxMkg4TzJTL2MxMy04LTUtNi0xMC0xMSgxMig4KTE0KTctMy0xLTItNC05KDcpMTUtMTAvaDEtNiwxMy0xNEgiAzY4MSoaMjAyMi0wMS0wNFQxNDoxMjo1NC45Njk1Mjgy4AEKJQoCP3MSAj9wGgI/byIXaHR0cDovL2V4YW1wbGUub3JnL3Rlc3QSJwoCP28SIWh0dHA6Ly9oYXJ0aC5vcmcvYW5kcmVhcy9mb2FmI2JpbxI7CgI/cxI1aHR0cDovL29wZW5mbHlkYXRhLm9yZy9pZC9mbHliYXNlL2ZlYXR1cmUvRkJnbjAwNTM5MTkSMgoCP3ASLGh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNzZWVBbHNvIgEwKhoyMDIyLTAxLTA0VDE0OjEyOjU0Ljk2OTUyOFonCgI/bxIhaHR0cDovL2hhcnRoLm9yZy9hbmRyZWFzL2ZvYWYjYmlvWjIKAj9wEixodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjc2VlQWxzb1o7CgI/cxI1aHR0cDovL29wZW5mbHlkYXRhLm9yZy9pZC9mbHliYXNlL2ZlYXR1cmUvRkJnbjAwNTM5MTk=";
protoplan_to_graph(other);

const initialElements = [
	{
		id: '2',
		type: 'special',
		position: { x: 100, y: 100 },
		data: { text: 'A custom node', className: 'cnode' },
	},
	{
		id: '3',
		type: 'special',
		position: { x: 500, y: 100 },
		data: { text: 'Another custom node', className: 'cnode'  },
	},
	{
		id: '4',
		type: 'special',
		position: { x: 500, y: 300 },
		data: { text: 'Yet Another custom node', className: 'cnode' },
	},
    {
		id: '5',
		type: 'special',
		position: { x: 50, y: 300 },
		data: { text: 'Small', className: 'cnode' },
	},
    {
		id: '6',
		type: 'special',
		position: { x: 800, y: 300 },
		data: { text: 'Another leaf', className: 'cnode' },
	},
    {
		id: '7',
		type: 'special',
		position: { x: 800, y: 100 },
		data: { text: 'Small', className: 'cnode' },
	},
    {
		id: '8',
		type: 'special',
		position: { x: 800, y: 200 },
		data: { text: 'Another leaf', className: 'cnode' },
	},
	{id: 'e1-2', source: '2', target: '3', animate: 'false'},
    {id: 'e5-2', source: '5', target: '2', animate: 'false'},
	{id: 'e1-X', source: '2', target: '4', animate: 'false'},
    {id: 'e4-6', source: '4', target: '6', animate: 'false'},
    {id: 'e3-7', source: '3', target: '7', animate: 'false'},
    {id: 'e4-8', source: '4', target: '8', animate: 'false'},
	
];

function swapLeafs(n1, n2, elements) {
    var p1 = getIncomers(n1, elements).at(0);
    var p2 = getIncomers(n2, elements).at(0);
    var eP1toN2 = { id: p1.id + '-' + n2.id, source: p1.id, target: n2.id };
    var eP2toN1 = { id: p2.id + '-' + n1.id, source: p2.id, target: n1.id };
    return [eP1toN2, eP2toN1];
}

function swapInternalNodes(n1, n2, elements) {
    var p1 = getIncomers(n1, elements);
    var p2 = getIncomers(n2, elements);
    var edges = [];
    if (p1.length > 0) {
        p1 = p1.at(0);
        if (p1.id === n2.id )
            edges.push({ id: n1.id + '-' + n2.id, source: n1.id, target: n2.id });
        else
            edges.push({ id: p1.id + '-' + n2.id, source: p1.id, target: n2.id });
    }
    if (p2.length > 0){
        p2 = p2.at(0);
        if (p2.id === n1.id )
            edges.push({ id: n2.id + '-' + n1.id, source: n2.id, target: n1.id });
        else
            edges.push({ id: p2.id + '-' + n1.id, source: p2.id, target: n1.id });
    }
    var childsN1 = getOutgoers(n1, elements);
    var childsN2 = getOutgoers(n2, elements);
    childsN1.forEach((c) => {
        if (c.id !== n2.id) {
            edges.push({id: 'e'+n2.id+'-'+c.id, source: n2.id, target:c.id})
        }

    })
    childsN2.forEach((c) => {
        if (c.id !== n1.id) {
            edges.push({id: 'e'+n1.id+'-'+c.id, source: n1.id, target:c.id})
        }

    })
    return edges;
}

const NodesDebugger = () => {
  const nodes = useStoreState((state) => state.nodes);

  console.log(nodes);

  return null;
};

const CustomNodeExample = () => {
    const [elements, setElements] = useState(initialElements);
    const [lastSelection, setLastSelection] = useState(null);

    const onElementClick = (_, element) => {
        if (lastSelection != null && lastSelection !== element) {
            console.log('Change position of ', lastSelection.id, ' and ', element.id);

            var n1 = {...lastSelection, position: element.position};
            var n2 = {...element, position: lastSelection.position};
            var n1childs = getOutgoers(lastSelection, elements).length;
            var n2childs =getOutgoers(element, elements).length;
            if ( n1childs === 0 && n2childs === 0) {
                var edges = swapLeafs(n1,n2, elements);
                console.log("swap leafs", lastSelection.id, " and ", element.id);
                setElements((els) => removeElements([lastSelection, element], els));
                setElements((els) => els.concat(n1, n2, edges));
            }
            else if (n1childs > 0 && n2childs > 0) {
                var edges = swapInternalNodes(n1, n2, elements);
                console.log("swap leafs", lastSelection.id, " and ", element.id);
                setElements((els) => removeElements([lastSelection, element], els));
                setElements((els) => els.concat(n1, n2, edges));
            }
            else {
                console.log('Cannot swap internal and leafs');
            }
            console.log(elements);
            setLastSelection(null);
        }
        else {
            console.log('Register ', element.id, ' as last selection.')
            setLastSelection(element);
        }
    }


    return (
        <div style={{ height: 600 }}>
            <ReactFlow elements={elements} nodeTypes={nodeTypes}
                    onElementClick={onElementClick}>
              <NodesDebugger />
            </ReactFlow>
        </div>
	);
};

export default CustomNodeExample;
