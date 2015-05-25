'use strict';

var assert = require('assert');
var fs = require('fs');
var join = require('path').join;
var test = require('testit');

var transform = require('../');

var input = fs.readFileSync(join(__dirname, 'input.txt')).toString();
var options = require('./options');
var locals = require('./locals');
var expected = fs.readFileSync(join(__dirname, 'expected.txt')).toString();

function assertEqual(output, expected) {
  console.log('   Output:\t'   + JSON.stringify(output));
  console.log('   Expected:\t' + JSON.stringify(expected));
  assert.equal(output, expected);
}

test(transform.name + '.render()', function () {
  if (transform.render) {
    var output = transform.render(input, options, locals);
    assertEqual(output, expected);
  }
});

test(transform.name + '.compile()', function () {
  if (transform.compile) {
    var output = transform.compile(input, options)(locals);
    assertEqual(output, expected);
  }
});
