import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar'
import ReactFlow, {
    isEdge,
    getConnectedEdges,
    getOutgoers,
    getIncomers,
    useStoreState,
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
} from 'react-flow-renderer';

import CustomNodeComponent from './CustomNodeComponent';
//import Sidebar from './Sidebar';
//import './Provider.css';
import { protoplan_to_graph } from './planparser';
import LayoutFlow from './LayoutFlow';

const nodeTypes = {
	special: CustomNodeComponent,
};

let sparqlRequest = {
  "query": "SELECT * { ?s ?p ?o }",
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
    const [userQuery, setUserQuery] = useState(null);
    const [query, setQuery] = useState(sparqlRequest);
    const [toggle, setToggle] = useState(false);
    const [stop, setStop] = useState(false);

    const handleChange = (event) => {
        setUserQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        if (userQuery !== null) {
            console.log("send user query");
            setQuery(JSON.parse(userQuery));
            setUserQuery(null);
        }
        setToggle(!toggle);
        event.preventDefault();
    };

    const run = () => {
        var i = 0;
        while (!stop && i < 20) {
            setToggle(!toggle);
            i++;
        }
    }







    useEffect(() => {
        console.log("fetching ", JSON.stringify(query));
        fetch(sparqlServer, {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                "Content-type": "application/json",
                "accept": "application/json"
            }
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                let graph = protoplan_to_graph(data["next"]);
                setQuery( {...query, next:data["next"]} )
                setElements(graph);
            })
            .catch(error => console.log(error));
    }, [setElements, toggle]);

    return (



        <div style={{ height: 500 }}>

        <header>
        <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">
      Execution plan
      </Navbar.Brand>
      </Navbar>
      </header>

      <div style={{
    padding:'5px 5px 5px 5px'}}>

            <LayoutFlow
                initialElements={elements}
                nodeTypes={nodeTypes}>
            </LayoutFlow>


            <div style={{backgroundColor: '#DCDCDC',
          height: '100%',
          width:'18%',
          border:'1px solid black ',
          borderRadius: 5,
        }}>

            <form onSubmit={handleSubmit} style={{padding:'10px 0 0 5px'}}>
                <label><b>Query</b></label>
                <br/>
              <textarea id="sparqlQuery" name="sparqlquery" defaultValue={JSON.stringify(query)} rows="5" cols="25"  onChange={handleChange}/>
                <br/>
                <Button variant="light" type="submit">Send</Button>
            </form>
            <div style={{ padding:'10px 0 0 5px' }}>
          <ButtonGroup aria-label="Basic example" >
          <Button variant="secondary" active onClick={run}>Run</Button>
          <Button variant="secondary" active onClick={() => setStop(true)}>Stop</Button>
          </ButtonGroup>
          </div>
          </div>


          </div>
        </div>
    );
};

export default CustomNodeExample;
