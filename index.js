module.exports = toposort;

/**
 * Topological sorting
 * @param idProp {String} The property of the objects in `edges`, which should be used as the identifier
 * @param ancestryProp {String} The property of the objects in `edges`, which should be used as the ancestry list
 * @param edges {Array} A list of objects that have both properties.
 * @returns {Array} a list of identifiers, sorted by their ancestry
 */
function toposort(idProp, ancestryProp, edges) {
   var nodes = {} // a hash of id=>node
     , sorted = [] // sorted list of ids
     , visited = {} // hash: id=>bool

  // list all nodes by id
  edges.forEach(function(edge) {
    nodes[getId(edge)] = edge;
  })

  // topologically sort the nodes by ancestry
  edges.forEach(function visit(node, ancestors) {
    if (!Array.isArray(ancestors)) ancestors = []
    
    var id = getId(node)

    // if we already visited this, do nothing
    if (visited[id]) return;

    ancestors.push(id) // ancestor list gets passed to all ancestors
    visited[id] = true

    getAncestors(node).forEach(function(ancestor) {
      // if already in ancestors, a cyclic dependency exists.
      if (ancestors.indexOf(ancestor) >= 0) {
        throw new Error('Cyclic dependency : ' + ancestor + ' depends on ' + id +', but is a dependency of it.')
      }
      
      // recursively apply 'visit' to all ancestors
      visit(nodes[ancestor], ancestors.map(function(o){return o}))
    })

    sorted.unshift(id)
  })

  return sorted;
  
  
  function getId(obj) {
    return obj[idProp]
  }
  
  function getAncestors(obj) {
    return obj[ancestryProp]
  }
}