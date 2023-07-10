import { makeNodesHash, makeOutgoingEdges, uniqueNodes } from './helpers.js'
import { validateEdges } from './validators.js'

function visitFactory(visited: Record<string, boolean>, outgoingEdges: Map<unknown, Set<unknown>>, nodesHash: Map<unknown, number>, sorted: any[], cursor: number) {
  function visit(node: unknown, i: number, predecessors: Set<unknown>) {
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

    const outgoingSet: (Set<unknown> | unknown[]) = outgoingEdges.get(node) || new Set()
    const outgoing = [...outgoingSet]
    i = outgoing.length

    if (i) {
      predecessors.add(node)
      do {
        const child: any = outgoing[--i]
        visit(child, nodesHash.get(child) as number, predecessors)
      } while (i)
      predecessors.delete(node)
    }

    sorted[--cursor] = node
  }

  return visit
}

export function toposortCore(nodes: unknown[], edges: unknown[][]) {
  const cursor = nodes.length
  let i = cursor
  const sorted = [cursor]
  const visited: Record<string, boolean> = {}
  const nodesHash = makeNodesHash(nodes)
  const outgoingEdges = makeOutgoingEdges(edges)
  const visit = visitFactory(visited, outgoingEdges, nodesHash, sorted, cursor)

  while (i--) {
    if (!visited[i]) visit(nodes[i], i, new Set())
  }

  return sorted
}

export function toposort(nodes: unknown[], edges: unknown[][]) {
  validateEdges(nodes, edges)

  return toposortCore(nodes, edges)
}

export function toposortDefault(edges: unknown[][]) {
  return toposort(uniqueNodes(edges), edges)
}

toposortDefault.array = toposort

