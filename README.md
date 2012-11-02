# Sort directed graphs

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

A quick analysis, will result in the following dependency (and thus execution) flow:

```
ron
 - bar
   - john
     - tom
   - foo
```

Let's try this with `toposort`:
```
toposort = require('toposort')

var plugins =
[ {name: "foo", depends: ['bar']}
, {name: "bar", depends: ["ron"]}
, {name: "john", depends: ["bar"]}
, {name: "tom", depends: ["john"]}
, {name: "ron", depends: []}
]

var result = toposort('name', 'depends', plugins)

// we reverse the resulting list, because
// toposort assumes ancestry, but we want descendancy
console.dir(result.reverse())
```

Output:
```
[ 'ron', 'bar', 'foo', 'john', 'tom' ]
```

## API

### toposort(idProperty, ancestryProperty, list)
 * idProperty {String} The property of the objects in the `list`, which should be used as the identifier
 * ancestryProperty {String} The property of the objects in `list`, which should be used as the ancestry list
 * list {Array} A list of objects that have both properties.

Returns a list of identifiers, sorted by their ancestry.

## Legal
MIT License