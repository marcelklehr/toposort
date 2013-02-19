/*!
 * Toposort - Topological sorting for node.js
 * Copyright (c) 2012 by Marcel Klehr <mklehr@gmx.net>
 *
 * MIT LICENSE
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

module.exports = toposort;

/**
 * Topological sorting function
 * @param edges {Array} An array of edges like [node1, node2]
 * @returns {Array} a list of nodes, sorted by their dependency (following edge direction as descendancy)
 */
function toposort(edges) {
   var nodes = [] // a list of id=>node
     , sorted = [] // sorted list of ids

  // list all nodes by id
  edges.forEach(function(edge) {
    edge.forEach(function insertNode (n) {
      if(nodes.indexOf(n) >= 0) return;
      nodes.push(n)
    })
  })

  while (nodes.length > 0)
    visit(nodes[0], null, edges, nodes, sorted)

  return sorted;
}

function visit(node, predecessors, edges, nodes, sorted) {
  if (!predecessors) predecessors = []
  else // The node is a dependency of itself?! I'd say, we're free to throw
  if(predecessors.indexOf(node) >= 0)
   throw new Error('Cyclic dependency! The following node is a dependency of itself: '+JSON.stringify(node))

  // if it's not in nodes[] anymore, we've already had this node
  if (nodes.indexOf(node) < 0) return;
  
  // remove this node from nodes[]
  nodes.splice(nodes.indexOf(node), 1)

  var predsCopy = predecessors.map(function(n) {return n})
  predsCopy.push(node)
  
  edges
   .filter(function(e) { return e[0] === node })
   .forEach(function(e) {
     // visit all dependencies of this node
     // and provide them with a *copy* of their predecessors (including *this* node)
     visit(e[1], predsCopy, edges, nodes, sorted)
   })

  sorted.unshift(node)
}
