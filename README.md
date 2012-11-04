# Sorting directed acyclic graphs
`npm install toposort`

## Example
Let's say, you have a list of plugins, which depend on each other:
```
var plugins =
[ {name: "foo", depends: ['bar']}
, {name: "bar", depends: ["ron"]}
, {name: "john", depends: ["bar"]}
, {name: "tom", depends: ["john"]}
, {name: "ron", depends: []}
]
```
`depends` defines plugins that should be executed before the plugin that declares the directive.

A quick analysis, will result in the following dependency tree:

```
tom
 |
john  foo
 |     |
 - - - - 
    |
   bar
    |
   ron
```

and thus the following execution flow:

```
   ron
    |
   bar
 - - - - 
 |     |
john  foo
 |
tom
```

Let's try this with `toposort`:
```
toposort = require('toposort')

var plugins =
[ ["foo", 'bar']
, ["bar", "ron"]
, ["john", "bar"]
, ["tom", "john"]
]

var results = toposort(plugins)// this will output the dependency flow
results.reverse()// to get the resulting execution flow, we reverse the results
console.dir(results)
```

Output:
```
[ 'ron', 'bar', 'foo', 'john', 'tom' ]
```

## API

### toposort(edges)
 * edges {Array} An array of edges like [node1, node2]

Returns: {Array} a list of nodes, sorted by their dependency (following edge direction as descendancy)

## Tests
Run the tests with `node test.js`.

## Legal
MIT License