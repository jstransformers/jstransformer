'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('compileClientAsync - with tr.compileClientAsync(src, options) => Promise(str)', function (override) {
  var sentinel = {};
  var bodySentinel = {};
  var cbSentinel = {};
  var normalizedSentinel = {};
  override('normalizeAsync', function (body, cb) {
    assert(body === bodySentinel);
    assert(cb === cbSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClientAsync: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return bodySentinel;
    }
  });
  assert(tr.compileClientAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('compileClientAsync - with tr.compileClient(src, options) => fn', function (override) {
  var sentinel = {};
  var bodySentinel = {};
  var cbSentinel = {};
  var normalizedSentinel = {};
  override('normalizeAsync', function (body, cb) {
    assert(body === bodySentinel);
    assert(cb === cbSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClient: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return bodySentinel;
    }
  });
  assert(tr.compileClientAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('compile - without tr.compileClient', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFile: function () {
    }
  });
  return tr.compileClientAsync('example input', {}).then(function () {
    throw new Error('expected to have an error');
  }, function (err) {
    if (!/does not support/.test(err.message)) {
      throw err;
    }
  });
});
