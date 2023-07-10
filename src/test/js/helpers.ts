import { suite } from 'uvu'
import assert from 'node:assert'
import {
  makeIncomingEdges,
  groupByComponents,
  uniqueNodes,
  getAdjacencyMapOfIndirectedGraph,
  visitDepthFirst,
} from '../../main/js/helpers.js'
import {
  oneComponentGraphWithLoop,
  twoComponentGraph,
  oneComponentGraph,
  twoComponentGraphWithLoop,
  generateSquareDenseGraph,
} from './graphs.js'

const test = suite('helpers')

const makeIncomingEdgesTests = [
  {
    input: [[1, 3], [1, 2], [2, 4], [2, 5], [6, 7], [6, 8], [9, 8]],
    output: new Map(
      [
        [1, new Set()],
        [2, new Set([1])],
        [3, new Set([1])],
        [4, new Set([2])],
        [5, new Set([2])],
        [6, new Set()],
        [7, new Set([6])],
        [8, new Set([6, 9])],
        [9, new Set()],
      ],
    ),
  },
]

makeIncomingEdgesTests.forEach(({ input, output }) => {
  test(`makeIncomingEdges(${input})`, () => {
    assert.deepEqual(makeIncomingEdges(input), output)
  })
})

const groupByComponentsTests = [
  {
    description: 'two component graph',
    input: twoComponentGraph,
    output: [
      new Set([1, 2, 3, 4, 5]),
      new Set([6, 7, 8, 9]),
    ],
  },
  {
    description: 'the same two component graph but the order differs',
    input: [[1, 3], [2, 5], [6, 7], [2, 4], [6, 8], [9, 8], [1, 2]], // the same graph but the order differs
    output: [
      new Set([1, 2, 3, 4, 5]),
      new Set([6, 7, 8, 9]),
    ],
  },
  {
    description: 'one component graph',
    input: oneComponentGraph, // one graph
    output: [
      new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    ],
  },
  {
    description: 'one component graph with loop',
    input: oneComponentGraphWithLoop,
    output: [
      new Set([6, 7, 8, 9])
    ],
  },
  {
    description: 'two component graph with loop',
    input: twoComponentGraphWithLoop,
    output: [
      new Set([1, 2, 3, 4, 5]),
      new Set([6, 7, 8, 9])
    ],
  },
  {
    description: 'empty graph',
    input: [],
    output: [],
  },
]

groupByComponentsTests.forEach(({ description, input, output }) => {
  test(`groupByComponents, ${description}`, () => {
    const res = groupByComponents({ edges: input })
    assert.deepEqual(res, output)
  })
})

const visitDepthFirstTestCases = [
  {
    description: 'it visits all nodes of one-component graph',
    graph: oneComponentGraph,
    node: 1,
    visited: uniqueNodes(oneComponentGraph),
  },
  {
    description: 'it visits all nodes of a given component of two-component graph',
    graph: twoComponentGraph,
    node: 1,
    visited: [1, 2, 3, 4, 5],
  },
]

visitDepthFirstTestCases.forEach(({ description, graph, node, visited }) => {
  test(`visitDepthFirst ${description}`, () => {
    const adjacencyMap = getAdjacencyMapOfIndirectedGraph(graph)

    const visitedNodes = visitDepthFirst({ node, adjacencyMap })

    assert.deepEqual(visitedNodes, new Set(visited))
  })
})

test('visitDepthFirst handles graph with 10 000 nodes in a proper time', () => {
  const maxPerformTime = 1000
  const graph = generateSquareDenseGraph({ width: 100, height: 100 })
  const adjacencyMap = getAdjacencyMapOfIndirectedGraph(graph)

  const start = Date.now()
  const visited = visitDepthFirst({ node: '0_0', adjacencyMap })
  const time = Date.now() - start

  assert.equal(visited.size, uniqueNodes(graph).length)
  assert.ok(time < maxPerformTime, `took ${time} ms, should be < ${maxPerformTime}`)
})

test.run()
