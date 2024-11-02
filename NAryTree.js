class NaryTreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
}

function buildNaryTree(edges) {
  const nodes = new Map();

  edges.forEach(({ from, to }) => {
    if (!nodes.has(from)) nodes.set(from, new NaryTreeNode(from));
    if (!nodes.has(to)) nodes.set(to, new NaryTreeNode(to));
  });

  edges.forEach(({ from, to }) => {
    nodes.get(from).children.push(nodes.get(to));
  });

  return nodes.get(edges[0].from);
}

function inOrderTraversalNary(node, result = []) {
  if (!node) return result;

  node.children.forEach(child => {
    inOrderTraversalNary(child, result);
  });

  result.push(node.value);

  return result;
}

module.exports = {
  buildNaryTree,
  inOrderTraversalNary,
}