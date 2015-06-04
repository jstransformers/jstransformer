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

test('compile - without tr.compile, but with tr.render => fn', function (override) {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function (str, options, locals) {
      assert(str === 'example input');
      return locals.name;
    }
  });
  assert(tr.compile('example input', {}).fn({name: 'hola'}) === 'hola');
});
