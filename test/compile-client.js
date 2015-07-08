'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('compileClient', function () {

test('with tr.compileClient(src, options) => str', function (override) {
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
test('without any of the above', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClientAsync: function () {
    }
  });
  assert.throws(function () {
    tr.compileClient('example input', {});
  }, /does not support compiling for the client synchronously/);
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFileClient: function () {
    }
  });
  assert.throws(function () {
    tr.compileClient('example input', {});
  }, /does not support compiling for the client from a string/);
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFile: function () {
    }
  });
  assert.throws(function () {
    tr.compileClient('example input', {});
  }, /does not support compiling for the client/);
});

});
