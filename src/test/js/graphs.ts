// src/test/resources/graphs/two-component.svg
export const twoComponentGraph = [[1, 3], [1, 2], [2, 4], [2, 5], [6, 7], [6, 8], [9, 8]]

// src/test/resources/graphs/one-component.svg
export const oneComponentGraph = [[1, 3], [1, 2], [2, 4], [2, 5], [3, 2], [5, 6], [4, 9], [6, 7], [6, 8], [9, 8]]

// src/test/resources/graphs/two-component-graph-with-loop.svg
export const twoComponentGraphWithLoop = [[1, 3], [1, 2], [2, 4], [2, 5], [6, 7], [6, 8], [9, 8], [7, 6]]


// src/test/resources/graphs/one-component-with-loop.svg
export const oneComponentGraphWithLoop = [[6, 7], [6, 8], [9, 8], [7, 6]]

// src/test/resources/graphs/one-component-with-complex-loop.svg
export const oneComponentGraphWithComplexLoop = [[1, 3], [1, 2], [2, 4], [2, 5], [3, 2], [5, 6], [4, 9], [6, 7], [6, 8], [9, 8], [7, 1]]

const getEdgesForNode = ({ prefix = '', i, j, maxI, maxJ }) => {
  const node = `${prefix}${i}_${j}`
  const res = []
  if (i < maxI) {
    res.push([node, `${prefix}${i + 1}_${j}`])
  }
  if (j < maxJ) {
    res.push([node, `${prefix}${i}_${j + 1}`])
  }
  if (j < maxJ && i < maxI) {
    res.push([node, `${prefix}${i + 1}_${j + 1}`])
  }
  return res
}

// src/test/resources/graphs/dense-square.svg
export const generateSquareDenseGraph = ({ width, height, prefix }) => {
  const edges = []

  for(let i = 0; i < width; i++) {
    for(let j = 0; j < height; j++) {
      edges.push(...getEdgesForNode({ prefix, i, j, maxI: width - 1, maxJ: height - 1 }))
    }
  }

  return edges
}
