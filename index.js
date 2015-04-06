'use strict';

exports.name = 'foo';
exports.inputFormats = ['foo', 'foobar'];
exports.outputFormat = 'html';

exports.render = function (str, options) {
  return str;
}
