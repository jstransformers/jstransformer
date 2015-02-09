'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('render - with tr.render(src, options) => str', function (override) {
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
    render: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  assert(tr.render('example input', sentinel) === normalizedSentinel);
});
test('render - with tr.compile(src, options) => fn', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  override('normalizeFn', function (body) {
    assert(body === fnSentinel);
    return {
      fn: function (locals) {
        return '<br />';
      },
      dependencies: ['example.js']
    };
  });
  override('normalize', function (result) {
    assert.deepEqual(result, {
      body: '<br />',
      dependencies: ['example.js']
    });
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
  assert(tr.render('example input', sentinel) === normalizedSentinel);
});
test('render - without tr.render', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClient: function () {
    }
  });
  assert.throws(function () {
    tr.render('example input', {});
  }, /does not support/);
});
