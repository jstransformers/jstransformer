'use strict';

var assert = require('assert');
var Promise = require('promise');
var test = require('./test');
var createTransformer = require('../');

test('compileFileAsync - with tr.compileFileAsync(src, options) => Promise(fn)', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var cbSentinel = {};
  var normalizedSentinel = {};
  override('normalizeFnAsync', function (fn, cb) {
    assert(fn === fnSentinel);
    assert(cb === cbSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFileAsync: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileFileAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('compileFileAsync - with tr.compileFile(src, options) => fn', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var cbSentinel = {};
  var normalizedSentinel = {};
  override('normalizeFnAsync', function (fn, cb) {
    assert(fn === fnSentinel);
    assert(cb === cbSentinel);
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
  assert(tr.compileFileAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('compileFileAsync - with tr.compileAsync(src, options) => Promise(fn)', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var cbSentinel = {};
  var normalizedSentinel = {};
  override('readFile', function (filename, encoding) {
    assert(filename === 'example-input.txt');
    assert(encoding === 'utf8');
    return {then: function (fn) { return fn('example input'); }};
  });
  override('normalizeFnAsync', function (fn, cb) {
    assert(fn === fnSentinel);
    assert(cb === cbSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileAsync: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileFileAsync('example-input.txt', sentinel, cbSentinel) === normalizedSentinel);
});
test('compileFileAsync - with tr.compile(src, options) => fn', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var cbSentinel = {};
  var normalizedSentinel = {};
  override('readFile', function (filename, encoding) {
    assert(filename === 'example-input.txt');
    assert(encoding === 'utf8');
    return {then: function (fn) { return fn('example input'); }};
  });
  override('normalizeFnAsync', function (fn, cb) {
    assert(fn === fnSentinel);
    assert(cb === cbSentinel);
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
  assert(tr.compileFileAsync('example-input.txt', sentinel, cbSentinel) === normalizedSentinel);
});
test('compileFileAsync - without tr.compile, tr.compileAsync, tr.compileFile or tr.compileFileAsync', function (override) {
  override('readFile', function (filename) {
    assert(filename === 'example-input.txt');
    return Promise.resolve('example input');
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function () {
    }
  });
  return tr.compileFileAsync('example-input.txt', {}).then(function () {
    throw new Error('Expected error');
  }, function (err) {
    if (!(/does not support/.test(err.message))) throw err;
  });
});
