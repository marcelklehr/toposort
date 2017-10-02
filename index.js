
/**
 * Topological sorting function
 *
 * @param {Array} edges
 * @returns {Array}
 */

module.exports = function(edges){
  return toposort(uniqueNodes(edges), edges)
}

module.exports.array = toposort

function toposort(nodes, edges) {
  var cursor = nodes.length
    , sorted = new Array(cursor)
    , visited = {}
    , i = cursor
    // Better data structures make algorithm much faster.
    , outgoingEdges = makeOutgoingEdges(edges)
    , nodesHash = makeNodesHash(nodes)

  while (i--) {
    if (!visited[i]) visit(nodes[i], i, {})
  }

  return sorted

  function visit(node, i, predecessors) {
    if(predecessors.hasOwnProperty(node)) {
      throw new Error('Cyclic dependency: '+JSON.stringify(node))
    }

    if (!nodesHash.hasOwnProperty(node)) {
      throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: '+JSON.stringify(node))
    }

    if (visited[i]) return;
    visited[i] = true

    var outgoing = Object.keys(outgoingEdges[node] || {})

    if (i = outgoing.length) {
      predecessors[node] = true
      do {
        var child = outgoing[--i]
        visit(child, nodesHash[child], predecessors)
      } while (i)
      delete predecessors[node]
    }

    sorted[--cursor] = node
  }
}

function uniqueNodes(arr){
  var res = {}
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i]
    res[edge[0]] = true
    res[edge[1]] = true
  }
  return Object.keys(res)
}

function makeOutgoingEdges(arr){
  var edges = {}
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i]
    edges[edge[0]] = edges[edge[0]] || {}
    edges[edge[1]] = edges[edge[1]] || {}
    edges[edge[0]][edge[1]] = true
  }
  return edges
}

function makeNodesHash(arr){
  var res = {}
  for (var i = 0, len = arr.length; i < len; i++) {
    res[arr[i]] = i
  }
  return res
}
