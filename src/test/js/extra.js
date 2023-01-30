import { suite } from 'uvu'
import assert from 'node:assert'
import { toposortExtra } from '../../main/js/extra.js'
import {
  oneComponentGraph,
  oneComponentGraphWithComplexLoop,
  twoComponentGraph,
  twoComponentGraphWithLoop,
  generateSquareDenseGraph,
} from './graphs.js'

const test = suite('array')

const normalizeToposortExtraResult = (res) => {
  res.sources.sort()
  res.prev.forEach(value => value.sort())
  res.next.forEach(value => value.sort())
  res.graphs.forEach(graph => {
    graph.nodes.sort()
    graph.sources.sort()
  })
  return res
}

test('toposortExtra returns separate arrays for separate graphs', () => {
  const res = toposortExtra({ edges: twoComponentGraph })

  assert.deepEqual(
    normalizeToposortExtraResult(res),
    normalizeToposortExtraResult({
      sources: [1, 6, 9],
      prev: new Map([
        [1, []],
        [3, [1]],
        [2, [1]],
        [4, [2]],
        [5, [2]],
        [6, []],
        [7, [6]],
        [8, [6, 9]],
        [9, []],
      ]),
      next: new Map([
        [1, [2, 3]],
        [3, []],
        [2, [4, 5]],
        [4, []],
        [5, []],
        [6, [7, 8]],
        [7, []],
        [8, []],
        [9, [8]],
      ]),
      graphs: [
        {
          nodes: [1, 3, 2, 4, 5],
          sources: [1]
        },
        {
          nodes: [6, 7, 8, 9],
          sources: [6, 9]
        }
      ]
    }),
  )
})

test('toposortExtra returns one array for one graph', () => {
  const res = toposortExtra({ edges: oneComponentGraph })

  assert.deepEqual(
    normalizeToposortExtraResult(res),
    normalizeToposortExtraResult({
      sources: [1],
      prev: new Map([
        [1, []],
        [3, [1]],
        [2, [1, 3]],
        [4, [2]],
        [5, [2]],
        [6, [5]],
        [7, [6]],
        [8, [6, 9]],
        [9, [4]],
      ]),
      next: new Map([
        [1, [2, 3]],
        [3, [2]],
        [2, [4, 5]],
        [4, [9]],
        [5, [6]],
        [6, [7, 8]],
        [7, []],
        [8, []],
        [9, [8]],
      ]),
      graphs: [
        {
          nodes: [1, 3, 2, 4, 9, 8, 6, 5, 7],
          sources: [1]
        },
      ]
    }),
  )
})

test('toposortExtra works with giant one-component graph with in proper time', () => {
  const width = 100
  const height = 100
  const maxPerformTime = 1000
  const nodesCount = width * height
  const graph = generateSquareDenseGraph({ width, height, prefix: 'a' })
  graph.sort(() => Math.random() > 0.5 ? 1 : -1)

  const start = Date.now()
  const res = toposortExtra({ edges: graph })
  const diff = Date.now() - start

  assert.ok(diff < maxPerformTime, `took ${diff}, should be < ${maxPerformTime}`)
  assert.equal(res.graphs.length, 1)
  assert.deepEqual(
    res.sources,
    ['a0_0'],
  )
  assert.equal(res.graphs[0].nodes.length, nodesCount)
})

test('toposortExtra works with giant four-component graph with in proper time', () => {
  const width = 100
  const height = 100
  const nodesCount = width * height * 4
  const maxPerformTime = 1000
  const graph = [
    ...generateSquareDenseGraph({ width, height, prefix: 'a' }),
    ...generateSquareDenseGraph({ width, height, prefix: 'b' }),
    ...generateSquareDenseGraph({ width, height, prefix: 'c' }),
    ...generateSquareDenseGraph({ width, height, prefix: 'd' })
  ]
  graph.sort(() => Math.random() > 0.5 ? 1 : -1)

  const start = Date.now()
  const res = toposortExtra({ edges: graph })
  const diff = Date.now() - start

  assert.ok(diff < maxPerformTime, `took ${diff} ms, should be < ${maxPerformTime}`)
  assert.equal(res.graphs.length, 4)
  assert.deepEqual(
    res.sources.sort(),
    ['a0_0', 'b0_0', 'c0_0', 'd0_0'].sort(),
  )
  assert.equal(res.graphs.reduce((acc, graph) => acc + graph.nodes.length, 0), nodesCount)
})

test('toposortExtra throws an error for cyclic graph', () => {
  assert.throws(
    () => toposortExtra({ edges: twoComponentGraphWithLoop, throwOnCycle: true }),
    {
      message: 'Cyclic dependency, node was:6',
    },
  )
})

test('toposortExtra throws an error for a graph with a complex cycle', () => {
  assert.throws(
    () => toposortExtra({ edges: oneComponentGraphWithComplexLoop, throwOnCycle: true }),
    {
      message: 'Cyclic dependency, node was:1',
    },
  )
})

test('toposortExtra does not throws an error for a graph with a complex cycle when throwOnCycle is undefined', () => {
  toposortExtra({ edges: oneComponentGraphWithComplexLoop })
})

test('toposortExtra throws an error when there are unknown nodes', () => {
  assert.throws(
    () => toposortExtra({
      nodes: [1, 2, 4, 5, 6, 7, 8, 9],
      edges: [[1, 3], [1, 2], [2, 4], [2, 5], [6, 7], [6, 8], [9, 8], [7, 6]],
      throwOnCycle: true,
    }),
    {
      message: 'Unknown node. There is an unknown node in the supplied edges.',
    },
  )
})

test('toposortExtra throws an error when there are unknown nodes', () => {
  assert.throws(
    () => toposortExtra({
      nodes: [1, 2, 4, 5, 6, 7, 8, 9],
      edges: [[1, 3], [1, 2], [2, 4], [2, 5], [6, 7], [6, 8], [9, 8], [7, 6]],
    }),
    {
      message: 'Unknown node. There is an unknown node in the supplied edges.',
    },
  )
})

test.run()
