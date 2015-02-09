'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('compileFile - with tr.compileFile(src, options) => fn', function (override) {
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
    compileFile: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileFile('example input', sentinel) === normalizedSentinel);
});
test('compileFile - with tr.compile(src, options) => fn', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('readFileSync', function (filename) {
    assert(filename === 'example-input.txt');
    return 'example input';
  });
  override('normalizeFn', function (fn) {
    assert(fn == fnSentinel);
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
  assert(tr.compileFile('example-input.txt', sentinel) === normalizedSentinel);
});
test('compileFile - without tr.compile or tr.compileFile', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function () {
    }
  });
  assert.throws(function () {
    tr.compileFile('example input', {});
  }, /does not support/);
});
