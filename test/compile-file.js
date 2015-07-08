'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('compileFile', function () {

test('with tr.compileFile(src, options) => fn', function (override) {
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
test('with tr.compile(src, options) => fn', function (override) {
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
test('with tr.renderFile(src, options, locals) => output', function (override) {
  var sentinel = {};
  var localsSentinel = {};
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    renderFile: function (file, options, locals) {
      assert(file === 'example-input.txt');
      assert(options === sentinel);
      assert(locals === localsSentinel);
      return 'example output';
    }
  });
  assert(tr.compileFile('example-input.txt', sentinel).fn(localsSentinel) === 'example output');
});
test('with tr.render(src, options, locals) => output', function (override) {
  var sentinel = {};
  var localsSentinel = {};
  override('readFileSync', function (filename) {
    assert(filename === 'example-input.txt');
    return 'example input';
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function (str, options, locals) {
      assert(str === 'example input');
      assert(options === sentinel);
      assert(locals === localsSentinel);
      return 'example output';
    }
  });
  assert(tr.compileFile('example-input.txt', sentinel).fn(localsSentinel) === 'example output');
});
test('without any of the above', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileAsync: function () {
    }
  });
  assert.throws(function () {
    tr.compileFile('example input', {});
  }, /does not support synchronous compilation/);
});

});
