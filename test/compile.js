'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('compile - with tr.compile(src, options) => fn', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('normalizeFn', function (fn) {
    assert(fn === fnSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compile: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  assert(tr.compile('example input', sentinel) === normalizedSentinel);
});
test('compile - without tr.compile', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFile: function () {
    }
  });
  assert.throws(function () {
    tr.compile('example input', {});
  }, /does not support/);
});
