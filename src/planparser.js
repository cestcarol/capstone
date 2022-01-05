var proto = require('./iterators_pb');
var test = new proto.RootTree();
console.log(test);
const saved_plan = "ErQBErEBCiUKAj9zEgI/cBoCP28iF2h0dHA6Ly9leGFtcGxlLm9yZy90ZXN0GikKAj9wEiNodHRwOi8vcHVybC5vcmcvZ29vZHJlbGF0aW9ucy9wcmljZRoKCgI/bxIEIjM2IhowCgI/cxIqaHR0cDovL2RiLnV3YXRlcmxvby5jYS9+Z2FsdWMvd3NkYm0vT2ZmZXIxIgMyNDYqGjIwMjEtMTItMTdUMTU6MTg6NTAuNTE1OTIy";

const leaf = ['scanSource', 'insertSource', 'deleteSource', 'valueLeft', 'valuesRight', 'scanLeft', 'scanRight', 'deleteLeft', 'deleteRight', 'insertLeft', 'insertRight'];
const is_leaf = (op) => {
  return leaf.includes(op);
}

const node = ['projSource', 'joinSource', 'unionSource', 'filterSource', 'projLeft', 'projRight', 'joinLeft', 'joinRight', 'unionLeft', 'unionRight', 'filterLeft', 'filterRight'];
const is_node = (op) => {
  return node.includes(op);
}

const iterate = (obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj.hasOwnProperty(key)) {
        if (typeof(obj[key]) !== 'object')
          console.log(`key: ${key}, value: ${obj[key]}`);
        else {
          console.log(key);
          iterate(obj[key])
        }
      }
    })
}

const breadth_iter = (obj) => {
  var vertex = [];
  var edges = [];
  var queue = [[obj, null]];
  var id = 0;
  var parent = null;

  while (queue.length > 0) {
    var [obj, parentId] = queue.shift();
    for (let key in obj) {
      if (obj[key] !== undefined && (is_node(key) || is_leaf(key))) {
        vertex.push({id: id, type: 'special', position: { x: 100, y: 100 }, data: { text: key, className: 'cnode' }});
        queue.push([obj[key], id]);
        if (parentId !== null) {
          edges.push({id: 'e'+parentId+id, source: parentId, target: id, animate: 'false'});
        }
        id++;
      }
    }
  }
  return vertex.concat(edges);
}

export function protoplan_to_graph(plan) {
  console.log(plan);
  var decodeplan = Buffer.from(plan, 'base64');
  console.log(decodeplan);
  var jsonplan = proto.RootTree.deserializeBinary(decodeplan).toObject();
  console.log(jsonplan);
  const graph = breadth_iter(jsonplan);
  console.log("Breadth iteration -> \n", graph);
  return graph;
}
