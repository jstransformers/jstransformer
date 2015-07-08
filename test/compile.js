'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('compile', function () {

test('with tr.compile(src, options) => fn', function (override) {
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

test('with tr.render(src, options, locals) => output', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function (str, options, locals) {
      assert(str === 'example input');
      return locals.name;
    }
  });
  assert.equal(tr.compile('example input').fn({name: 'hola'}), 'hola');
});
test('without any of the above', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFile: function () {
    }
  });
  assert.throws(function () {
    tr.compile('example input', {});
  }, /does not support compiling plain strings/);
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileAsync: function () {
    }
  });
  assert.throws(function () {
    tr.compile('example input', {});
  }, /does not support synchronous compilation/);
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClient: function () {
    }
  });
  assert.throws(function () {
    tr.compile('example input', {});
  }, /does not support compilation/);
});

});
