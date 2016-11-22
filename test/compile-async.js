'use strict';

var assert = require('assert');
var Promise = require('promise');
var test = require('./test');
var createTransformer = require('../');

test('compileAsync', function () {

test('with tr.compileAsync(str, options) => Promise(fn)', function (override) {
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
test('with tr.compile(str, options) => fn', function () {
  var sentinel = {};
  var fnSentinel = function (locals) {};
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compile: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  return tr.compileAsync('example input', sentinel).then(function (out) {
    assert(out.fn === fnSentinel);
  });
});
test('with tr.render(str, options, locals) => output', function () {
  var sentinel = {};
  var localsSentinel = {};
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
  return tr.compileAsync('example input', sentinel).then(function (out) {
    assert(out.fn(localsSentinel) === 'example output');
  });
});
test('with tr.renderAsync(str, options, locals) => Promise(fn)', function () {
  var sentinel = {};
  var localsSentinel = {};
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    renderAsync: function (str, options, locals) {
      return new Promise(function (resolve, reject) {
        resolve('example output')
      })
    }
  });
  return tr.compileAsync('example input', sentinel).then(function (out) {
    assert(out.fn(localsSentinel) === 'example output');
  });
});
test('without any of the above', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFile: function (filename, options) {
    }
  });
  return tr.compileAsync('example input', {}).then(function () {
    throw new Error('Expected error');
  }, function (err) {
    if (!(/does not support compiling plain strings/.test(err.message))) throw err;
  });
});

});
