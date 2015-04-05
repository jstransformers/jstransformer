'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('inputFormats - with tr.inputFormats', function (override) {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    inputFormats: [
      'html',
      'htm'
    ],
    render: function (str, options) {
      return str;
    }
  });
  assert.deepEqual(tr.inputFormats, ['html', 'htm']);
});

test('inputFormats - without tr.inputFormats', function (override) {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'html',
    render: function (str, options) {
      return str;
    }
  });
  assert.deepEqual(tr.inputFormats, ['test']);
});
