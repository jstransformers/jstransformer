'use strict';

var testit = require('testit');
var tr = require('../');

module.exports = test;
function test(name, fn) {
  function testBody (done) {
    var originals = {}, result;
    try {
      if (done) {
        result = fn(function (name, overrider) {
          originals[name] = tr[name];
          tr[name] = overrider;
        }, function (err) {
          restore();
          return done(err);
        });
      } else {
        result = fn(function (name, overrider) {
          originals[name] = tr[name];
          tr[name] = overrider;
        });
      }
    } catch (ex) {
      restore();
      throw ex;
    }
    restore();
    if (Object.keys(originals).length === 0) {
      return result;
    } else if (result) {
      return result.then(function () {
        restore();
      }, function (err) {
        restore();
        throw err;
      });
    } else {
      restore();
    }
    function restore () {
      Object.keys(originals).forEach(function (key) {
        tr[key] = originals[key];
      });
    }
  }
  if (fn.length < 2) {
    testit(name, function () {
      return testBody();
    });
  } else {
    testit(name, function (done) {
      return testBody(done);
    });
  }
}
