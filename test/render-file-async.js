'use strict';

var Promise = require('promise');
var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('renderFileAsync', function () {

test('with tr.renderFileAsync(file, options, locals) => Promise(str)', function (override) {
  var sentinel = {};
  var localSentinel = {};
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    renderFileAsync: function (file, options, locals) {
      assert(file === 'example-input.txt');
      assert(options === sentinel);
      assert(locals === localSentinel);
      return Promise.resolve('example output');
    }
  });
  return tr.renderFileAsync('example-input.txt', sentinel, localSentinel).then(function (rendered) {
    assert(rendered.body === 'example output');
  });
});
test('with tr.renderFile(file, options, locals) => str', function (override) {
  var sentinel = {};
  var localSentinel = {};
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
  return tr.renderFileAsync('example-input.txt', sentinel, localSentinel).then(function (rendered) {
    assert(rendered.body === 'example output');
  });
});
test('with tr.renderAsync(src, options, locals) => Promise(str)', function (override) {
  var sentinel = {};
  var localSentinel = {};
  override('readFile', function (filename) {
    assert(filename === 'example-input.txt');
    return Promise.resolve('example input');
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    renderAsync: function (str, options, locals) {
      assert(str === 'example input');
      assert(options === sentinel);
      assert(locals === localSentinel);
      return Promise.resolve('example output');
    }
  });
  return tr.renderFileAsync('example-input.txt', sentinel, localSentinel).then(function (rendered) {
    assert(rendered.body === 'example output');
  });
});
test('with tr.render(src, options, locals) => str', function (override) {
  var sentinel = {};
  var localSentinel = {};
  override('readFile', function (filename) {
    assert(filename === 'example-input.txt');
    return Promise.resolve('example input');
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
  return tr.renderFileAsync('example-input.txt', sentinel, localSentinel).then(function (rendered) {
    assert(rendered.body === 'example output');
  });
});
test('with tr.compileFileAsync(file, options) => Promise(fn => Promise(str))', function (override) {
  var sentinel = {};
  var localSentinel = {};
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFileAsync: function (file, options) {
      assert(file === 'example-input.txt');
      assert(options === sentinel);
      return Promise.resolve(function (locals) {
        assert(locals === localSentinel);
        return Promise.resolve('example output');
      });
    }
  });
  return tr.renderFileAsync('example-input.txt', sentinel, localSentinel).then(function (rendered) {
    assert(rendered.body === 'example output');
  });
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
  return tr.renderFileAsync('example-input.txt', sentinel, localSentinel).then(function (rendered) {
    assert(rendered.body === 'example output');
  });
});
test('with tr.compileAsync(str, options) => Promise(fn => Promise(str))', function (override) {
  var sentinel = {};
  var localSentinel = {};
  override('readFile', function (filename) {
    assert(filename === 'example-input.txt');
    return Promise.resolve('example input');
  });
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileAsync: function (str, options) {
      assert(str === 'example input');
      assert(options === sentinel);
      return Promise.resolve(function (locals) {
        assert(locals === localSentinel);
        return Promise.resolve('example output');
      });
    }
  });
  return tr.renderFileAsync('example-input.txt', sentinel, localSentinel).then(function (rendered) {
    assert(rendered.body === 'example output');
  });
});
test('with tr.compile(str, options) => fn', function (override) {
  var sentinel = {};
  var localSentinel = {};
  override('readFile', function (filename) {
    assert(filename === 'example-input.txt');
    return Promise.resolve('example input');
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
  return tr.renderFileAsync('example-input.txt', sentinel, localSentinel).then(function (rendered) {
    assert(rendered.body === 'example output');
  });
});
test('without any of the above', function (override) {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    compileFileClientAsync: function () {
    }
  });
  assert.throws(function () {
    tr.renderFileAsync('example input', {}, {});
  }, /does not support rendering/);
});

});
