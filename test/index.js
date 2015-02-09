'use strict';

var assert = require('assert');
var test = require('testit');
var createTransformer = require('../');

test('constructor - throws if `tr` is not an object', function () {
  assert.throws(function () {
    createTransformer(false);
  }, /Transformer must be an object/);
});
test('constructor - throws if `tr` does not have a name', function () {
  assert.throws(function () {
    createTransformer({});
  }, /Transformer must have a name/);
});
test('constructor - throws if `tr` does not have an output format', function () {
  assert.throws(function () {
    createTransformer({name: 'test'});
  }, /Transformer must have an output format/);
});
test('constructor - throws if `tr` does not have any methods', function () {
  assert.throws(function () {
    createTransformer({name: 'test', outputFormat: 'html'});
  }, /Transformer must implement at least one of the potential methods/);
});
test('constructor - passes for a well formed transformer', function () {
  createTransformer({name: 'test', outputFormat: 'html', render: function () { return '<br/>'; }});
});

require('./compile');
require('./compile-async');
require('./compile-file');
require('./compile-file-async');
require('./compile-client');
require('./compile-client-async');
require('./compile-file-client');
require('./compile-file-client-async');
require('./render');
