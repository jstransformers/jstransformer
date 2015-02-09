'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('compileClient - with tr.compileClient(src, options) => str', function (override) {
  var sentinel = {};
  var localSentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('normalize', function (body) {
    assert(body === fnSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClient: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileClient('example input', sentinel) === normalizedSentinel);
});
test('compileClient - without tr.compileClient', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFile: function () {
    }
  });
  assert.throws(function () {
    tr.compileClient('example input', {});
  }, /does not support/);
});
