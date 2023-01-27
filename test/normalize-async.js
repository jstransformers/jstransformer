'use strict';

var assert = require('assert');
var test = require('./test');
var tr = require('../');

function testAsync (funcName, bodyVar, specs) {
  var func = tr[funcName];
  var bodyType = specs.good[0],
      body = specs.good[1],
      notBodyType = specs.bad[0],
      notBody = specs.bad[1];

  test(funcName, function () {
    test('Using callbacks', function (done) {
      var expected = { dependencies: [] };
      expected[bodyVar] = body;
      func(body, function (err, normalized) {
        if (err) return done(err);
        try {
          assert.deepEqual(normalized, expected);
        } catch (err) {
          return done(err);
        }
        func(notBody, function (err, normalized) {
          if (!err) return done(new Error('expecting error'));
          done();
        });
      });
    });

    test(bodyType + ' => Promise({ ' + bodyVar + ', dependencies })', function () {
      var expected = { dependencies: [] };
      expected[bodyVar] = body;
      return func(body).then(function (normalized) {
        assert.deepEqual(normalized, expected);
      });
    });

    test('{ ' + bodyVar + ': ' + bodyType + ' } => Promise({ ' + bodyVar + ', dependencies })', function () {
      var input = {};
      input[bodyVar] = body;
      return func(input).then(function (normalized) {
        input.dependencies = [];
        assert.deepEqual(normalized, input);
      });
    });

    test('{ ' + bodyVar + ': ' + bodyType + ', dependencies: [] } => Promise({ ' + bodyVar + ', dependencies })', function () {
      var input = { dependencies: [] };
      input[bodyVar] = body;
      var promise1 = func(input).then(function (normalized) {
        input.dependencies = [];
        assert.deepEqual(normalized, input);
      });

      input.dependencies = [ '/tmp/a.txt' ];
      var promise2 = func(input).then(function (normalized) {
        input.dependencies = [ '/tmp/a.txt' ];
        assert.deepEqual(normalized, input);
      });

      return Promise.all([promise1, promise2]);
    });

    test('{ ' + bodyVar + ': Promise(' + bodyType + ') } => Promise({ ' + bodyVar + ', dependencies })', function () {
      var input = {};
      input[bodyVar] = Promise.resolve(body);
      return func(input).then(function (normalized) {
        input.dependencies = [];
        input[bodyVar] = body;
        assert.deepEqual(normalized, input);
      });
    });

    test('{ ' + bodyVar + ': Promise(' + bodyType + '), dependencies: [] } => Promise({ ' + bodyVar + ', dependencies })', function () {
      var input = { dependencies: [] };
      input[bodyVar] = Promise.resolve(body);
      var promise1 = func(input).then(function (normalized) {
        input.dependencies = [];
        input[bodyVar] = body;
        assert.deepEqual(normalized, input);
      });

      input.dependencies = [ '/tmp/a.txt' ];
      var promise2 = func(input).then(function (normalized) {
        input.dependencies = [ '/tmp/a.txt' ];
        input[bodyVar] = body;
        assert.deepEqual(normalized, input);
      });

      return Promise.all([promise1, promise2]);
    });

    test('Promise(' + bodyType + ') => Promise({ ' + bodyVar + ', dependencies })', function () {
      var expected = { dependencies: [] };
      expected[bodyVar] = body;
      return func(Promise.resolve(body)).then(function (normalized) {
        assert.deepEqual(normalized, expected);
      });
    });

    test('Promise({ ' + bodyVar + ': ' + bodyType + ' }) => Promise({ ' + bodyVar + ', dependencies })', function () {
      var input = {};
      input[bodyVar] = body;
      return func(Promise.resolve(input)).then(function (normalized) {
        input.dependencies = [];
        assert.deepEqual(normalized, input);
      });
    });

    test('Promise({ ' + bodyVar + ': ' + bodyType + ', dependencies: [] }) => Promise({ ' + bodyVar + ', dependencies })', function () {
      var input = { dependencies: [] };
      input[bodyVar] = body;
      var promise1 = func(Promise.resolve(input)).then(function (normalized) {
        input.dependencies = [];
        assert.deepEqual(normalized, input);
      });

      input.dependencies = [ '/tmp/a.txt' ];
      var promise2 = func(Promise.resolve(input)).then(function (normalized) {
        input.dependencies = [ '/tmp/a.txt' ];
        assert.deepEqual(normalized, input);
      });

      return Promise.all([promise1, promise2]);
    });

    test('Promise({ ' + bodyVar + ': Promise(' + bodyType + '), dependencies: [] }) => Promise({ ' + bodyVar + ', dependencies })', function () {
      var input = { dependencies: [] };
      input[bodyVar] = Promise.resolve(body);
      var promise1 = func(Promise.resolve(input)).then(function (normalized) {
        input[bodyVar] = body;
        input.dependencies = [];
        assert.deepEqual(normalized, input);
      });

      // Use another promise
      input[bodyVar] = Promise.resolve(body);
      input.dependencies = [ '/tmp/a.txt' ];
      var promise2 = func(Promise.resolve(input)).then(function (normalized) {
        input[bodyVar] = body;
        input.dependencies = [ '/tmp/a.txt' ];
        assert.deepEqual(normalized, input);
      });

      return Promise.all([promise1, promise2]);
    });

    test(notBodyType + ' => Promise(throw)', function () {
      return assertPromiseError(func(notBody), /Invalid result object/);
    });

    test('{ ' + bodyVar + ': ' + notBodyType + ', dependencies: [] } => Promise(throw)', function () {
      var input = { dependencies: [] };
      input[bodyVar] = notBody;
      return assertPromiseError(func(input), /Invalid result object/);
    });

    test('{ ' + bodyVar + ': ' + bodyType + ', dependencies: Number } => Promise(throw)', function () {
      var input = { dependencies: 1 };
      input[bodyVar] = body;
      return assertPromiseError(func(input), /dependencies .* array/);
    });

    test('Promise(' + notBodyType + ') => Promise(throw)', function () {
      return assertPromiseError(func(Promise.resolve(notBody)), /Invalid result object/);
    });

    test('Promise({ ' + bodyVar + ': ' + notBodyType + ', dependencies: [] }) => Promise(throw)', function () {
      var input = { dependencies: [] };
      input[bodyVar] = notBody;
      return assertPromiseError(func(Promise.resolve(input)), /Invalid result object/);
    });

    test('Promise({ ' + bodyVar + ': ' + bodyType + ', dependencies: Number }) => Promise(throw)', function () {
      var input = { dependencies: 1 };
      input[bodyVar] = body;
      return assertPromiseError(func(Promise.resolve(input)), /dependencies .* array/);
    });

    test('{ ' + bodyVar + ': Promise(' + notBodyType + '), dependencies: [] } => Promise(throw)', function () {
      var input = { dependencies: [] };
      input[bodyVar] = Promise.resolve(notBody);
      return assertPromiseError(func(input), /Invalid result object/);
    });

    test('{ ' + bodyVar + ': Promise(' + bodyType + '), dependencies: Number } => Promise(throw)', function () {
      var input = { dependencies: 1 };
      input[bodyVar] = Promise.resolve(body);
      return assertPromiseError(func(input), /dependencies .* array/);
    });

    test('Promise({ ' + bodyVar + ': Promise(' + notBodyType + '), dependencies: [] }) => Promise(throw)', function () {
      var input = { dependencies: [] };
      input[bodyVar] = Promise.resolve(notBody);
      return assertPromiseError(func(Promise.resolve(input)), /Invalid result object/);
    });

    test('Promise({ ' + bodyVar + ': Promise(' + bodyType + '), dependencies: Number }) => Promise(throw)', function () {
      var input = { dependencies: 1 };
      input[bodyVar] = Promise.resolve(body);
      return assertPromiseError(func(Promise.resolve(input)), /dependencies .* array/);
    });
  });
}

testAsync('normalizeAsync', 'body', {
  good: [ 'String',   '<html></html>' ],
  bad:  [ 'Function', function () {} ]
});
testAsync('normalizeFnAsync', 'fn', {
  good: [ 'Function', function () {} ],
  bad:  [ 'String',   '<html></html>' ]
});

function assertPromiseError (promise, regex) {
  return promise.then(function () {
    throw new Error('expected error');
  }, function (err) {
    if (!regex || regex.test(err.message)) return;
    throw new Error('not the expected error message: ' + err.message);
  });
}
