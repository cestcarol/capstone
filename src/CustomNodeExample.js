import React, { useState, useEffect } from 'react';
import ReactFlow, { removeElements, getOutgoers, getIncomers, useStoreState, 
    // isEdge, getConnectedEdges, ReactFlowProvider, MiniMap,
} from 'react-flow-renderer';

import CustomNodeComponent from './CustomNodeComponent';
import { protoplan_to_graph } from './planparser';

const nodeTypes = {
	special: CustomNodeComponent,
};

let sparqlRequest = {
  "query": "SELECT ?s ?k { ?s ?p ?o . ?o ?p ?k . FILTER regex(?s, 'r', 'i') }",
  "defaultGraph": "http://example.org/test"
};
let sparqlServer = "http://localhost:8000/sparql";

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
    const [elements, setElements] = useState([]);
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

    useEffect(() => {
        fetch(sparqlServer, {
            method: 'POST',
            body: JSON.stringify(sparqlRequest),
            headers: {
                "Content-type": "application/json",
                "accept": "application/json"
            }
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                let graph = protoplan_to_graph(data["next"]);
                setElements((els) => els = graph);
            })
            .catch(error => console.log(error));
    }, [setElements]);

    return (
        <div style={{ height: 600 }}>
            <ReactFlow elements={elements} nodeTypes={nodeTypes}
                    onElementClick={onElementClick}>
            </ReactFlow>
        </div>
	);
};

export default CustomNodeExample;



/*
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
*/
