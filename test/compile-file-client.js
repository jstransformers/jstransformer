'use strict';

var assert = require('assert');
var Promise = require('promise');
var test = require('./test');
var createTransformer = require('../');

test('compileFileClient - with tr.compileFileClient(filename, options) => fn', function (override) {
  var optionsSentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('normalize', function (fn) {
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
  assert(tr.compileFileClient('example-input.txt', optionsSentinel) === normalizedSentinel);
});

test('compileFileClient - with tr.compileClient(filename, options) => fn', function (override) {
  var optionsSentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('readFileSync', function (filename, encoding) {
    assert(filename === 'example-input.txt');
    assert(encoding === 'utf8');
    return 'example input';
  });
  override('normalize', function (fn) {
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
  assert(tr.compileFileClient('example-input.txt', optionsSentinel) === normalizedSentinel);
});

test('compileFileClient - without tr.compileClient or tr.compileFileClient', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClientAsync: function () {
    }
  });
  assert.throws(function () {
    tr.compileFileClient('example-input.txt', {});
  }, /does not support compiling for the client synchronously/);
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function () {
    }
  });
  assert.throws(function () {
    tr.compileFileClient('example-input.txt', {});
  }, /does not support compiling for the client/);
});
