'use strict';

var assert = require('assert');
var test = require('./test');
var tr = require('../');

function testSync (funcName, bodyVar, specs) {
  var func = tr[funcName];
  var bodyType = specs.good[0],
      body = specs.good[1],
      notBodyType = specs.bad[0],
      notBody = specs.bad[1];

  test(funcName, function () {
    test(bodyType + ' => { ' + bodyVar + ', dependencies }', function () {
      var normalized = func(body);
      var expected = { dependencies: [] };
      expected[bodyVar] = body;
      assert.deepEqual(normalized, expected);
    });

    test('{ ' + bodyVar + ': ' + bodyType + ' } => { ' + bodyVar + ', dependencies }', function () {
      var input = {};
      input[bodyVar] = body;
      var normalized = func(input);
      input.dependencies = [];
      assert.deepEqual(normalized, input);
    });

    test('{ ' + bodyVar + ': ' + bodyType + ', dependencies: [] } => { ' + bodyVar + ', dependencies }', function () {
      var input = { dependencies: [] };
      input[bodyVar] = body;
      var normalized = func(input);
      assert.deepEqual(normalized, input);

      input.dependencies = [ '/tmp/a.txt' ];
      normalized = func(input);
      assert.deepEqual(normalized, input);
    });

    test(notBodyType + ' => throw', function () {
      assert.throws(function () {
        func(notBody);
      }, /Invalid result object/);
    });

    test('{ blah: ' + bodyType + ' } => throw', function () {
      var input = { blah: body };
      assert.throws(function () {
        func(input);
      }, /Invalid result object/);
    });

    test('{ ' + bodyVar + ': ' + notBodyType + ', dependencies: [] } => throw', function () {
      var input = { dependencies: [] };
      input[bodyVar] = notBody;
      assert.throws(function () {
        func(input);
      }, /Invalid result object/);
    });

    test('{ ' + bodyVar + ': ' + bodyType + ', dependencies: Number } => throw', function () {
      var input = { dependencies: 1 };
      input[bodyVar] = body;
      assert.throws(function () {
        func(input);
      }, /dependencies .* array/);
    });
  });
}

testSync('normalize', 'body', {
  good: [ 'String',   '<html></html>' ],
  bad:  [ 'Function', function () {} ]
});
testSync('normalizeFn', 'fn', {
  good: [ 'Function', function () {} ],
  bad:  [ 'String',   '<html></html>' ]
});
