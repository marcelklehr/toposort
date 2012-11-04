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
      if(nodes.indexOf(n) > 0) return;
      nodes.push(n)
    })
  })
  
  while (nodes.length > 0) {
    var cyclic = true
    nodes.forEach(function(n) {
      // go on, if some edges point to this node
      if (edges.some(function(e) { return e[1] == n; })) return;
      
      // remove this node
      nodes.splice(nodes.indexOf(n), 1)
      
      edges = edges.filter(function(e) { return !(e[0] == n)})
      cyclic = false
      sorted.push(n)
    })
    if (cyclic) throw new Error('Cyclic dependency couldn\'t be resolved.')
  }
  return sorted;
}