import { makeNodesHash, makeOutgoingEdges, uniqueNodes } from './helpers.js'
import { validateEdges } from './validators.js'

function visitFactory(visited, outgoingEdges, nodesHash, sorted, cursor) {
  function visit(node, i, predecessors) {
    if (predecessors.has(node)) {
      let nodeRep
      try {
        nodeRep = ', node was:' + JSON.stringify(node)
      } catch {
        nodeRep = ''
      }
      throw new Error('Cyclic dependency' + nodeRep)
    }

    if (!nodesHash.has(node)) {
      throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: ' + JSON.stringify(node))
    }

    if (visited[i]) return
    visited[i] = true

    let outgoing = outgoingEdges.get(node) || new Set()
    outgoing = [...outgoing]
    i = outgoing.length

    if (i) {
      predecessors.add(node)
      do {
        const child = outgoing[--i]
        visit(child, nodesHash.get(child), predecessors)
      } while (i)
      predecessors.delete(node)
    }

    sorted[--cursor] = node
  }

  return visit
}

export function toposortCore(nodes, edges) {
  let cursor = nodes.length
  let i = cursor
  const sorted = [cursor]
  const visited = {}
  const nodesHash = makeNodesHash(nodes)
  const outgoingEdges = makeOutgoingEdges(edges)
  const visit = visitFactory(visited, outgoingEdges, nodesHash, sorted, cursor)

  while (i--) {
    if (!visited[i]) visit(nodes[i], i, new Set())
  }

  return sorted
}

export function toposort(nodes, edges) {
  validateEdges(nodes, edges)

  return toposortCore(nodes, edges)
}

export function toposortDefault(edges) {
  return toposort(uniqueNodes(edges), edges)
}

toposortDefault.array = toposort

