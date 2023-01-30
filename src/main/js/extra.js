import {
  uniqueNodes,
  groupByComponents,
  getStartNodes,
  makeOutgoingEdges,
  makeIncomingEdges,
} from './helpers.js'
import { validateEdges, validateArgs, validateDag } from './validators.js'

export function toposortExtra (opts) {
  validateArgs(opts)

  const nodes = opts.nodes || uniqueNodes(opts.edges)
  const edges = opts.edges

  validateEdges(nodes, edges)

  const prev = new Map([...makeIncomingEdges(edges)].map(([node, neighborsSet]) => [node, [...neighborsSet]]))
  const next = new Map([...makeOutgoingEdges(edges)].map(([node, neighborsSet]) => [node, [...neighborsSet]]))
  const sources = getStartNodes(edges)

  if (opts.throwOnCycle) {
    validateDag({ edges, nodes, outgoing: next })
  }

  return {
    sources,
    prev,
    next,
    graphs: groupByComponents({ edges })
      .map(graphNodesSet => {
        return {
          nodes: [...graphNodesSet],
          sources: sources.filter(node => graphNodesSet.has(node))
        }
      })
  }
}

