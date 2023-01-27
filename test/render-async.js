'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('renderAsync', function () {

test('with tr.renderAsync(src, options) => str', function (override) {
  var sentinel = {};
  var localSentinel = {};
  var fnSentinel = {};
  var cbSentinel = function () {};
  var normalizedSentinel = {};
  override('normalizeAsync', function (body, cb) {
    assert(body === fnSentinel);
    assert(cb === cbSentinel);
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    renderAsync: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return fnSentinel;
    }
  });
  assert(tr.renderAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('with tr.render(src, options) => str', function (override) {
  var sentinel = {};
  var localSentinel = {};
  var fnSentinel = {};
  var cbSentinel = function () {};
  var normalizedSentinel = {};
  override('normalizeAsync', function (body, cb) {
    assert(body === fnSentinel);
    assert(cb === cbSentinel);
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
  assert(tr.renderAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('with tr.compileAsync(src, options) => fn', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  var cbSentinel = function () {};

  override('normalizeAsync', function (result) {
    assert.deepEqual(result, {
      body: '<br />',
      dependencies: ['example.js']
    });
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileAsync: function () {
      throw new Error('Did not expect this to be called');
    }
  });
  tr.compileAsync = function (str, options) {
    assert(str === 'example input');
    assert(options === sentinel);
    return {then: function (fn) { return fn({fn: function (locals) {
      assert(locals === sentinel);
      return '<br />';
    }, dependencies: ['example.js']}); }};
  };
  assert(tr.renderAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('with tr.compile(src, options) => fn', function (override) {
  var sentinel = {};
  var fnSentinel = {};
  var normalizedSentinel = {};
  var cbSentinel = function () {};

  override('normalizeAsync', function (result) {
    assert.deepEqual(result, {
      body: '<br />',
      dependencies: ['example.js']
    });
    return normalizedSentinel;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compile: function () {
      throw new Error('Did not expect this to be called');
    }
  });
  tr.compileAsync = function (str, options) {
    assert(str === 'example input');
    assert(options === sentinel);
    return {then: function (fn) { return fn({fn: function (locals) {
      assert(locals === sentinel);
      return '<br />';
    }, dependencies: ['example.js']}); }};
  };
  assert(tr.renderAsync('example input', sentinel, cbSentinel) === normalizedSentinel);
});
test('renderAsync(src, options, locals) - with tr.compile(src, options) => fn', function (override) {
  var nameSentinel = 'jstransformer';
  override('normalizeAsync', function (result) {
    return result;
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compile: function (str, options) {
      return function (locals) { return String(locals.name); };
    }
  });
  tr.renderAsync('example input', { blah: true }, { name: nameSentinel })
    .then(function (res) {
      assert.equal( res.body, nameSentinel)
    })
});
test('without any of the above', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    renderFileAsync : function () {
    }
  });
  var a = tr.renderAsync('example input', {}).then(function () {
    throw new Error('expected to have an error');
  }, function (err) {
    if (!/does not support rendering from a string/.test(err.message)) {
      throw err;
    }
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFileClient: function () {
    }
  });
  var b = tr.renderAsync('example input', {}).then(function () {
    throw new Error('expected to have an error');
  }, function (err) {
    if (!/does not support rendering/.test(err.message)) {
      throw err;
    }
  });
  return Promise.all([a, b]);
});

});
