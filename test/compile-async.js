'use strict';

var assert = require('assert');
var Promise = require('promise');
var test = require('./test');
var createTransformer = require('../');

test('compileAsync - with tr.compileAsync(str, options) => Promise(fn)', function (override) {
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
    compileAsync: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  assert(tr.compileAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('compileAsync - with tr.compile(str, options) => fn', function (override) {
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
    compile: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel
    }
  });
  assert(tr.compileAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('compileAsync - without tr.compile or tr.compileAsync', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function (str, options) {
    }
  });
  return tr.compileAsync('example input', {}).then(function () {
    throw new Error('Expected error');
  }, function (err) {
    if (!(/does not support/.test(err.message))) throw err;
  });
});
