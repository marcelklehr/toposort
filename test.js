var vows = require('vows')
  , toposort = require('./index')
  , assert = require('assert')

var suite = vows.describe('toposort')
suite.addBatch(
{ 'acyclic graphs':
  { topic: function() {
      return toposort(
      [ ["foo", 'bar']
      , ["bar", "ron"]
      , ["john", "bar"]
      , ["tom", "john"]
      ])
    }
  , 'should be sorted correctly': function(er, sorted) {
      assert.ifError(er)
      assert.deepEqual(sorted, [ 'foo','tom','john','bar','ron' ])
    }
  }
, 'cyclic graphs':
  { topic: function() {
      return toposort(
      [ ["foo", 'bar']
      , ["bar", "ron"]
      , ["john", "bar"]
      , ["tom", "john"]
      , ["ron", "tom"]// cyclic dependecy
      ])
    }
  , 'should throw an exception': function(_, val) {
      assert.instanceOf(val, Error)
    }
  }
})
.run(null, function() {
  (suite.results.broken+suite.results.errored) > 0 && process.exit(1)
})