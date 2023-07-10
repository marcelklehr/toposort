export function makeOutgoingEdges(arr: unknown[][]) {
  return arr.reduce((edges, [from, to]) => {
    edges.has(from) || edges.set(from, new Set());
    edges.has(to) || edges.set(to, new Set());
    edges.get(from).add(to);
    return edges;
  }, new Map());
}

export function makeIncomingEdges(arr: unknown[][]) {
  return arr.reduce((edges, [from, to]) => {
    edges.has(from) || edges.set(from, new Set());
    edges.has(to) || edges.set(to, new Set());
    edges.get(to).add(from);
    return edges;
  }, new Map());
}

export function getStartNodes(edges: unknown[][]) {
  const incomingEdges = makeIncomingEdges(edges);
  const startNodes: unknown[] = [];
  incomingEdges.forEach(
    (value, key) => value.size === 0 && startNodes.push(key)
  );

  return startNodes;
}

export function makeNodesHash(arr: unknown[]) {
  return new Map(arr.map((item, i) => [item, i]));
}

export function uniqueNodes(arr: unknown[][]) {
  const res = new Set();
  for (let i = 0, len = arr.length; i < len; i++) {
    const edge = arr[i];
    res.add(edge[0]);
    res.add(edge[1]);
  }
  return [...res];
}

export function visitDepthFirst({
  node,
  adjacencyMap,
}: {
  node: unknown;
  adjacencyMap: Map<any, any>;
}) {
  const visited = new Set();
  const stack = [node];
  let cur = node;
  while (cur) {
    visited.add(cur);
    const neighbors = [...adjacencyMap.get(cur)];
    stack.push(...neighbors.filter((item) => !visited.has(item)).reverse());
    cur = stack.pop();
  }
  return visited;
}

export function getAdjacencyMapOfIndirectedGraph(edges: unknown[][]) {
  return edges.reduce((acc, [from, to]) => {
    [
      [from, to],
      [to, from],
    ].forEach(([node, neighbor]) => {
      const neighbors = acc.get(node);
      if (neighbors) {
        neighbors.add(neighbor);
      } else {
        acc.set(node, new Set([neighbor]));
      }
    });
    return acc;
  }, new Map());
}

export function groupByComponents({ edges }: { edges: unknown[][] }) {
  const adjacencyMap: Map<any, any> = getAdjacencyMapOfIndirectedGraph(edges);
  const nodes = uniqueNodes(edges);
  const components = [];
  const visitedNodes = new Set();
  let currentNode = nodes[0];

  while (visitedNodes.size < nodes.length) {
    const visited = visitDepthFirst({ adjacencyMap, node: currentNode });
    components.push(visited);
    visited.forEach((node) => visitedNodes.add(node));
    currentNode = nodes.find((node) => !visitedNodes.has(node));
  }

  return components;
}
