var vows = require('vows')
  , toposort = require('./index')
  , assert = require('assert')

var suite = vows.describe('toposort')
suite.addBatch(
{ 'acyclic graphs':
  { topic: function() {
      return toposort(
      [ ["3", '2']
      , ["2", "1"]
      , ["6", "5"]
      , ["5", "2"]
      , ["5", "4"]
      ])
      /*(read downwards)
      6  3
      |  |
      5->2
      |  |
      4  1
      */
    }
  , 'should be sorted correctly': function(er, result) {
      assert.instanceOf(result, Array)
      var failed = [], passed
      ;[ [ '3','6','5','2','1','4' ]
      , [ '3','6','5','2','4','1' ]
      , [ '6','3','5','2','1','4' ]
      , [ '6','5','3','2','1','4' ]
      , [ '6','5','3','2','4','1' ]
      , [ '6','5', '4','3','2','1' ]
      ].forEach(function(solution) {
        try {
          assert.deepEqual(result, solution)
          passed = true
        }catch (e) {
          failed.push(e)
        }
      })
      if (!passed) {
        console.log(failed)
        throw failed[0];
      }
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
, 'triangular dependency':
  { topic: function() {
      return toposort([['a', 'b'], ['a', 'c'], ['b', 'c']]);
    }
  , 'shouldn\'t throw an error': function(er, result) {
      assert.deepEqual(result, ['a', 'b', 'c'])
    }
  }
})
.run(null, function() {
  (suite.results.broken+suite.results.errored) > 0 && process.exit(1)
})