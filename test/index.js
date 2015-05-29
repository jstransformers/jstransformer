'use strict';

var assert = require('assert');
var fs = require('fs');
var join = require('path').join;
var test = require('testit');

var transform = require('../');

var inputFile = join(__dirname, 'input.txt');
var input = fs.readFileSync(inputFile).toString();
var options = require('./options');
var locals = require('./locals');
var expected = fs.readFileSync(join(__dirname, 'expected.txt')).toString().trim();

function assertEqual(output, expected) {
  console.log('   Output:\t'   + JSON.stringify(output));
  console.log('   Expected:\t' + JSON.stringify(expected));
  assert.equal(output, expected);
}

if (transform.render) {
  test(transform.name + '.render()', function () {
    var output = transform.render(input, options, locals);
    assertEqual(output.trim(), expected);
  });
}

if (transform.compile) {
  test(transform.name + '.compile()', function () {
    var output = transform.compile(input, options)(locals);
    assertEqual(output.trim(), expected);
  });
}

if (transform.compileFile) {
  test(transform.name + '.compileFile()', function () {
    var output = transform.compileFile(inputFile, options)(locals);
    assertEqual(output, expected);
  });
}

if (transform.renderAsync) {
  test(transform.name + '.renderAsync()', function (done) {
    transform.renderAsync(input, options, locals).then(function (output) {
      assertEqual(output.trim(), expected);
      done();
    }, function (err) {
      done(err);
    }).done();
  });
}

if (transform.renderFileAsync) {
  test(transform.name + '.renderFileAsync()', function (done) {
    transform.renderFileAsync(inputFile, options, locals).then(function (output) {
      assertEqual(output.trim(), expected);
      done();
    }, function (err) {
      done(err);
    }).done();
  });
}

if (transform.compileFileAsync) {
  test(transform.name + '.compileFileAsync()', function (done) {
    transform.compileFileAsync(inputFile, options).then(function (template) {
      assertEqual(template(locals), expected);
      done();
    }, function (err) {
      done(err);
    }).done();
  });
}
