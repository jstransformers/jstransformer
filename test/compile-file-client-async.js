'use strict';

var assert = require('assert');
var Promise = require('promise');
var test = require('./test');
var createTransformer = require('../');

test('compileFileClientAsync - with tr.compileFileClientAsync(filename, options) => Promise(fn)', function (override) {
  var optionsSentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('normalizeAsync', function (fn) {
    assert(fn === fnSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFileClientAsync: function (filename, options) {
      assert(filename === 'example-input.txt');
      assert(options === optionsSentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileFileClientAsync('example-input.txt', optionsSentinel) === normalizedSentinel);
});
test('compileFileClientAsync - with tr.compileFileClient(filename, options) => fn', function (override) {
  var optionsSentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('normalizeAsync', function (fn) {
    assert(fn === fnSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFileClient: function (filename, options) {
      assert(filename === 'example-input.txt');
      assert(options === optionsSentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileFileClientAsync('example-input.txt', optionsSentinel) === normalizedSentinel);
});

test('compileFileClient - with tr.compileClientAsync(filename, options) => fn', function (override) {
  var optionsSentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('readFile', function (filename, encoding) {
    assert(filename === 'example-input.txt');
    assert(encoding === 'utf8');
    return {then: function (fn) { return fn('example input'); }};
  });
  override('normalizeAsync', function (fn) {
    assert(fn === fnSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClientAsync: function (str, options) {
      assert(str === 'example input');
      assert(options === optionsSentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileFileClientAsync('example-input.txt', optionsSentinel) === normalizedSentinel);
});
test('compileFileClient - with tr.compileClient(filename, options) => fn', function (override) {
  var optionsSentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('readFile', function (filename, encoding) {
    assert(filename === 'example-input.txt');
    assert(encoding === 'utf8');
    return {then: function (fn) { return fn('example input'); }};
  });
  override('normalizeAsync', function (fn) {
    assert(fn === fnSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClient: function (str, options) {
      assert(str === 'example input');
      assert(options === optionsSentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileFileClientAsync('example-input.txt', optionsSentinel) === normalizedSentinel);
});

test('compileFileClientAsync - without tr.compileClient, tr.compileClientAsync, tr.compileFileClient or tr.compileFileClientAsync', function (override) {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function () {
    }
  });
  return tr.compileFileClientAsync('example-input.txt', {}).then(function () {
    throw new Error('Missing expected error');
  }, function (err) {
    if (!/does not support/.test(err.message)) throw err;
  });
});
