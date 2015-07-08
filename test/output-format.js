'use strict';

var assert = require('assert');
var test = require('./test');
var createTransformer = require('../');

test('outputFormat - preserves tr.outputFormat', function () {
  var tr = createTransformer({
    name: 'test',
    outputFormat: 'css',
    render: function (str, options) {
      return str;
    }
  });
  assert.equal(tr.outputFormat, 'css');
});
test('outputFormat - throws without tr.outputFormat', function () {
  assert.throws(function () {
    createTransformer({
      name: 'test',
      render: function (str, options) {
        return str;
      }
    });
  }, /Transformer must have an output format/);
});
