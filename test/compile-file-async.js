'use strict';

var assert = require('assert');
var Promise = require('promise');
var test = require('./test');
var createTransformer = require('../');

test('compileFileAsync', function () {

test('with tr.compileFileAsync(src, options) => Promise(fn)', function (override) {
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
test('with tr.compileFile(src, options) => fn', function () {
  var sentinel = {};
  var fnSentinel = function (locals) {};
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFile: function (file, options) {
      assert(file === 'example-input.txt');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  return tr.compileFileAsync('example-input.txt', sentinel).then(function (out) {
    assert(out.fn === fnSentinel);
  });
});
test('with tr.compileAsync(src, options) => Promise(fn)', function (override) {
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
test('with tr.compile(src, options) => fn', function (override) {
  var sentinel = {};
  var fnSentinel = function (locals) {};
  override('readFile', function (filename, encoding) {
    assert(filename === 'example-input.txt');
    assert(encoding === 'utf8');
    return {then: function (fn) { return fn('example input'); }};
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
  return tr.compileFileAsync('example-input.txt', sentinel).then(function (out) {
    assert(out.fn === fnSentinel);
  });
});
test('with tr.renderFile(file, options, locals) => output', function () {
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
  return tr.compileFileAsync('example-input.txt', sentinel).then(function (out) {
    assert(out.fn(localsSentinel) === 'example output');
  });
});
test('with tr.render(src, options, locals) => output', function (override) {
  var sentinel = {};
  var localsSentinel = {};
  override('readFile', function (filename, encoding) {
    assert(filename === 'example-input.txt');
    assert(encoding === 'utf8');
    return {then: function (fn) { return fn('example input'); }};
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
  return tr.compileFileAsync('example-input.txt', sentinel).then(function (out) {
    assert(out.fn(localsSentinel) === 'example output');
  });
});
test('without any of the above', function (override) {
  override('readFile', function (filename) {
    assert(filename === 'example-input.txt');
    return Promise.resolve('example input');
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClient: function () {
    }
  });
  return tr.compileFileAsync('example-input.txt', {}).then(function () {
    throw new Error('Expected error');
  }, function (err) {
    if (!(/does not support/.test(err.message))) throw err;
  });
});

});
