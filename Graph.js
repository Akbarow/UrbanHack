const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

class Graph {
  
  constructor() {
    this.adjList = new Map();
  }

  addVertex(vertex) {
    this.adjList.set(vertex, []);
  }

  addEdge(v1, v2, weight) {
    this.adjList.get(v1).push({ node: v2, weight: weight });
    this.adjList.get(v2).push({ node: v1, weight: weight }); // For undirected graph
  }

  getPrimMST(startNode) {
    const mst = [];
    const visited = new Set();
    const minPQ = new MinPriorityQueue((a) => a.weight);

    this.adjList.get(startNode).forEach(edge => {
      minPQ.enqueue({ node: startNode, to: edge.node, weight: edge.weight });
    });
    visited.add(startNode);

    while (!minPQ.isEmpty()) {
      const { node, to, weight } = minPQ.dequeue();
      if (visited.has(to)) continue;
      mst.push({ from: node, to, weight });
      visited.add(to);
      this.adjList.get(to).forEach(edge => {
        if (!visited.has(edge.node)) {
          minPQ.enqueue({ node: to, to: edge.node, weight: edge.weight });
        }
      });
    }

    return mst;
  }
}

module.exports = {
  Graph
}