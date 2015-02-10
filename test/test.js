'use strict';

var testit = require('testit');
var tr = require('../');

module.exports = test;
function test(name, fn) {
  testit(name, function () {
    var originals = {}, result;
    try {
      result = fn(function (name, overrider) {
        originals[name] = tr[name];
        tr[name] = overrider;
      });
    } catch (ex) {
      Object.keys(originals).forEach(function (key) {
        tr[key] = originals[key];
      });
      throw ex;
    }
    Object.keys(originals).forEach(function (key) {
      tr[key] = originals[key];
    });
    if (Object.keys(originals).length === 0) {
      return result;
    } else if (result) {
      return result.then(function () {
        Object.keys(originals).forEach(function (key) {
          tr[key] = originals[key];
        });
      }, function (err) {
        Object.keys(originals).forEach(function (key) {
          tr[key] = originals[key];
        });
        throw err;
      });
    } else {
      Object.keys(originals).forEach(function (key) {
        tr[key] = originals[key];
      });
    }
  });
}
