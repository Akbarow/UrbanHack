const { Graph } = require("./Graph");
const { buildNaryTree, inOrderTraversalNary } = require("./NAryTree");
const { getRoute } = require("./GoogleApi");
const fs = require("fs");

let startingVertex = { name: "A", coordinates: [ 40.37328, 49.7945] }

let vertices = [
  { name: "B", coordinates: [40.3621, 49.8186] },
  { name: "C", coordinates: [40.5114, 49.9500] },
  { name: "D", coordinates: [40.3552, 49.8283] },
  { name: "E", coordinates: [40.4529, 49.7976] },
  { name: "F", coordinates: [40.5452, 49.8385] },
  { name: "G", coordinates: [40.3879, 49.8812] },
  { name: "H", coordinates: [40.4026, 49.9109] },
  { name: "I", coordinates: [40.4501, 49.7781] },
  { name: "J", coordinates: [40.3344991, 49.8001247] },
  { name: "K", coordinates: [40.4158, 49.8646] },
  { name: "L", coordinates: [40.3516, 49.8240] },
  { name: "M", coordinates: [40.3643, 49.9287] },
  { name: "N", coordinates: [40.4151, 49.7938] },
  { name: "O", coordinates: [40.3835399, 49.9372208] },
  { name: "P", coordinates: [40.3837, 49.8302] },
  { name: "Q", coordinates: [40.3867463, 49.9091136] },
  { name: "R", coordinates: [40.4037, 49.7540] },
  { name: "S", coordinates: [40.3753, 49.8204] },
  { name: "T", coordinates: [40.5387, 49.8821] },
  { name: "U", coordinates: [40.4680611, 49.8424229] }
]

async function getEdge(vertexOne, vertexTwo) {
  const originPoint = { latitude: vertexOne.coordinates[0], longitude: vertexOne.coordinates[1] };
  const destinationPoint = { latitude: vertexTwo.coordinates[0], longitude: vertexTwo.coordinates[1] };
  const result = await(await getRoute(originPoint, destinationPoint)).json();

  return {
    from: vertexOne.name,
    to: vertexTwo.name,
    distanceInMeters: result.routes[0].distanceMeters,
    duration: parseInt(result.routes[0].duration.replace('s', ''))
  }
}

const graph = new Graph();

for(let vertex of vertices) {
  graph.addVertex(vertex.name);
}

const metric = "distanceInMeters";
// const metric = 'duration';

const distances = JSON.parse(fs.readFileSync("distances.json").toString("utf-8"));
for(let i = 0; i < vertices.length; i++) {
  for(let j = i + 1; j < vertices.length; j++) {
    const vertexOne = vertices[i];
    const vertexTwo = vertices[j];
    const key = `${vertexOne.name}${vertexTwo.name}`;
    graph.addEdge(vertexOne.name, vertexTwo.name, distances[key][metric]);
  }
}

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = 3000;

app.get('/api/routes', (req, res, next) => {
  const startingVertexOfMST = Object.values(distances)
    .filter(o => o.from === 'A')
    .sort((o1, o2) => o1[metric] - o2[metric])[0].to;
  const mst = graph.getPrimMST(startingVertexOfMST);
  const root = buildNaryTree(mst);
  const inOrderResult = inOrderTraversalNary(root);

  let routes = [];
  for(let i = 0; i < inOrderResult.length; i++) {
    if(i % 4 === 0) {
      routes.push([ startingVertex ]);
    } 
    routes[routes.length - 1].push(vertices.find(v => v.name === inOrderResult[i]));
  }

  let optimalRoutes = [];
  for(let route of routes) {
    let optimalRoute = [];
    const graph = new Graph();
    for(let vertex of route) {
      graph.addVertex(vertex.name);
    }
    
    for(let i = 0; i < route.length; i++) {
      for(let j = i + 1; j < route.length; j++) {
        const vertexOne = route[i];
        const vertexTwo = route[j];
        const key = `${vertexOne.name}${vertexTwo.name}`;
        graph.addEdge(vertexOne.name, vertexTwo.name, distances[key][metric]);
      }
    }

    const mst = graph.getPrimMST('A');
    const root = buildNaryTree(mst);
    const inOrderResult = inOrderTraversalNary(root).reverse();
    
    for(let vertexName of inOrderResult)  {
      const vertex = [startingVertex, ...vertices].find(v => v.name === vertexName);
      optimalRoute.push(vertex);
    }

    optimalRoutes.push(optimalRoute);
  }


  res.send({
    routes, 
    optimalRoutes
  });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

exports.app = functions.https.onRequest(app);
