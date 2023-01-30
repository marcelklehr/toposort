import { makeNodesHash, makeOutgoingEdges, uniqueNodes } from './helpers.js'

export const validateEdges = (nodes, edges) => {
  const nodesHash = makeNodesHash(nodes)
  edges.forEach(function(edge) {
    if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
      throw new Error('Unknown node. There is an unknown node in the supplied edges.')
    }
  })
}

export const validateArgs = (opts) => {
  if (!opts) {
    throw new Error('No parameter provided')
  }

  if (!opts.edges) {
    throw new Error('Missing edges in opts')
  }
}

export function validateDag ({
  edges,
  nodes = uniqueNodes(edges),
  outgoing = makeOutgoingEdges(edges),
}) {
  const visited = new Set()
  const finished = new Set()

  const dfs = (node) => {
    if (finished.has(node)) {
      return
    }
    if (visited.has(node)) {
      throw new Error('Cyclic dependency, node was:' + node)
    }
    visited.add(node)
    outgoing.get(node).forEach((node) => dfs(node))
    finished.add(node)
  }
  nodes.forEach(node => dfs(node))
}

