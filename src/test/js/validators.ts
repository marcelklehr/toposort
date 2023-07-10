import { suite } from 'uvu'
import { validateArgs, validateEdges, validateDag } from '../../main/js/validators.js'
import assert from 'node:assert'
import {
  oneComponentGraph,
  oneComponentGraphWithComplexLoop,
  oneComponentGraphWithLoop, twoComponentGraph,
  twoComponentGraphWithLoop,
} from './graphs.js'

const test = suite('validators')

const validateArgsTestCases = [
  {
    description: 'it throws when there are no arguments',
    input: undefined,
    throws: true
  },
  {
    description: 'it does not throw when edges are given ',
    input: { edges: [[1, 2], [2, 3]] },
    throws: false
  },
  {
    description: 'it does not throw when edges and nodes are given',
    input: { nodes: [1, 2, 3], edges: [[1, 2], [2, 3]] },
    throws: false
  },
  {
    description: 'throws when the edges is undefined',
    input: { nodes: [1, 2, 3] },
    throws: true
  },
]

validateArgsTestCases.forEach(({ description, input, throws }) => test(description, () => {
  if (throws) {
    assert.throws(() => validateArgs(input))
  } else {
    validateArgs(input)
  }
}))

const validateEdgesTestCases = [
  {
    description: 'it does not throw without unknown nodes',
    input: [[1, 2, 3], [[1, 2], [2, 3]]],
    throws: false
  },
  {
    description: 'it throws when there are unknown nodes',
    input: [[1, 2, 3], [[1, 2], [2, 4]]],
    throws: true
  }
]

validateEdgesTestCases.forEach(({ description, input, throws }) => test(description, () => {
  if (throws) {
    assert.throws(() => validateEdges(...input))
  } else {
    validateEdges(...input)
  }
}))

const validateDagTestCases = [
  {
    description: 'throws for oneComponentGraphWithComplexLoop',
    graph: oneComponentGraphWithComplexLoop,
    throws: true,
    cycleNode: 1,
  },
  {
    description: 'throws for oneComponentGraphWithLoop',
    graph: oneComponentGraphWithLoop,
    throws: true,
    cycleNode: 6,
  },
  {
    description: 'throws for twoComponentGraphWithLoop',
    graph: twoComponentGraphWithLoop,
    throws: true,
    cycleNode: 6,
  },
  {
    description: 'does not throw for oneComponentGraph',
    graph: oneComponentGraph,
    throws: false,
  },
  {
    description: 'does not throw for the second component of twoComponentGraph',
    graph: twoComponentGraph,
    throws: false
  },
  {
    description: 'does not throw for the first component of twoComponentGraph',
    graph: twoComponentGraph,
    throws: false
  }
]

validateDagTestCases.forEach(({ description, graph, cycleNode, throws }) => {
  test(`validateDag ${description}`, () => {
    if (throws) {
      assert.throws(
        () => validateDag({ edges: graph }),
        {
          message: `Cyclic dependency, node was:${cycleNode}`
        }
      )
    } else {
      validateDag({ edges: graph })
    }
  })
})


test.run()
