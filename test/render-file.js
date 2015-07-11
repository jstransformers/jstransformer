'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('renderFile', function () {

test('with tr.renderFile(file, options, locals) => str', function (override) {
  var sentinel = {};
  var localSentinel = {};
  override('readFileSync', function (filename) {
    assert(filename === 'example-input.txt');
    return 'example input';
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    renderFile: function (file, options, locals) {
      assert(file === 'example-input.txt');
      assert(options === sentinel);
      assert(locals === localSentinel);
      return 'example output';
    }
  });
  assert(tr.renderFile('example-input.txt', sentinel, localSentinel).body === 'example output');
});
test('with tr.render(src, options, locals) => str', function (override) {
  var sentinel = {};
  var localSentinel = {};
  override('readFileSync', function (filename) {
    assert(filename === 'example-input.txt');
    return 'example input';
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function (str, options, locals) {
      assert(str === 'example input');
      assert(options === sentinel);
      assert(locals === localSentinel);
      return 'example output';
    }
  });
  assert(tr.renderFile('example-input.txt', sentinel, localSentinel).body === 'example output');
});
test('with tr.compileFile(file, options) => fn', function (override) {
  var sentinel = {};
  var localSentinel = {};
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFile: function (file, options) {
      assert(file === 'example-input.txt');
      assert(options === sentinel);
      return function (locals) {
        assert(locals === localSentinel);
        return 'example output';
      };
    }
  });
  assert(tr.renderFile('example-input.txt', sentinel, localSentinel).body === 'example output');
});
test('with tr.compile(str, options) => fn', function (override) {
  var sentinel = {};
  var localSentinel = {};
  override('readFileSync', function (filename) {
    assert(filename === 'example-input.txt');
    return 'example input';
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compile: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return function (locals) {
        assert(locals === localSentinel);
        return 'example output';
      };
    }
  });
  assert(tr.renderFile('example-input.txt', sentinel, localSentinel).body === 'example output');
});
test('without any of the above', function (override) {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileAsync: function () {
    }
  });
  assert.throws(function () {
    tr.renderFile('example input', {}, {});
  }, /does not support rendering synchronously/);

  tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileClient: function () {
    }
  });
  assert.throws(function () {
    tr.renderFile('example input', {}, {});
  }, /does not support rendering synchronously/);
});

});
