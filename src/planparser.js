var proto = require('./iterators_pb');

const leaf = ['scanSource', 'insertSource', 'deleteSource', 'valueLeft', 'valuesRight', 'scanLeft', 'scanRight', 'deleteLeft', 'deleteRight', 'insertLeft', 'insertRight'];
const is_leaf = (op) => {
  return leaf.includes(op);
}

const node = ['projSource', 'joinSource', 'unionSource', 'filterSource', 'projLeft', 'projRight', 'joinLeft', 'joinRight', 'unionLeft', 'unionRight', 'filterLeft', 'filterRight'];
const is_node = (op) => {
  return node.includes(op);
}

const breadth_iter = (obj) => {
  var vertex = [];
  var edges = [];
  var queue = [[obj, null]];
  var id = 0;

  while (queue.length > 0) {
    var [o, parentId] = queue.shift();
    for (let key in o) {
      if (o[key] !== undefined && (is_node(key) || is_leaf(key))) {
        vertex.push({id: id.toString(), type: 'special', position: { x: 100, y: 100 }, data: { text: key, className: 'cnode' }});
        queue.push([o[key], id]);
        if (parentId !== null) {
          edges.push({id: 'e'+parentId+id, source: parentId.toString(), target: id.toString(), animate: 'false'});
        }
        id++;
      }
    }
  }
  return vertex.concat(edges);
}

export function protoplan_to_graph(plan) {
  var decodeplan = Buffer.from(plan, 'base64');
  var jsonplan = proto.RootTree.deserializeBinary(decodeplan).toObject();
  console.log("Plan Request ", jsonplan);
  const graph = breadth_iter(jsonplan);
  console.log("Generated Graph", graph);
  return graph;
}
