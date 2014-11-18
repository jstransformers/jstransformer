'use strict';

var fs = require('fs');
var assert = require('assert');
var Promise = require('promise');
var readFile = Promise.denodeify(fs.readFile);

module.exports = function (transformer) {
  return new Transformer(transformer);
};

function normalize(result) {
  if (typeof result === 'string') {
    return {body: result, dependencies: []};
  } else if (result && typeof result === 'object' && typeof result.body === 'string') {
    if ('dependencies' in result) {
      if (!Array.isArray(result.dependencies)) {
        throw new Error('Result should have a dependencies property that is an array');
      }
    } else {
      result.dependencies = [];
    }
    return result;
  } else {
    throw new Error('Invalid result object from transform.');
  }
}
function normalizeAsync(result, cb) {
  return Promise.resolve(result).then(normalize).nodeify(cb);
}

function Transformer(tr) {
  assert(tr, 'Transformer must be an object');
  assert(typeof tr.name === 'string', 'Transformer must have a name');
  assert(typeof tr.outputFormat === 'string', 'Transformer must have an output format');
  assert(['render', 'renderAsync', 'renderFile', 'renderFileAsync'].some(function (method) {
    return typeof tr[method] === 'function';
  }), 'Transformer must implement at least one of the potential methods.');
  this._tr = tr;
  this.name = this._tr.name;
  this.outputFormat = this._tr.outputFormat;
}
Transformer.prototype.render = function (str, options) {
  if (typeof this._tr.render === 'function') {
    return normalize(this._tr.render(str, options));
  } else if (typeof this._tr.renderAsync === 'function') {
    throw new Error('This transform does not support synchronous rendering');
  } else {
    throw new Error('This transform does not support rendering plain strings');
  }
};
Transformer.prototype.renderAsync = function (str, options, cb) {
  if (typeof this._tr.renderAsync === 'function') {
    return normalizeAsync(this._tr.renderAsync(str, options), cb);
  } else if (typeof this._tr.render === 'function') {
    return normalizeAsync(this._tr.render(str, options), cb);
  } else {
    throw new Error('This transform does not support rendering of plain strings');
  }
};

Transformer.prototype.renderFile = function (filename, options) {
  if (typeof this._tr.renderFile === 'function') {
    return normalize(this._tr.renderFile(filename, options));
  } else if (typeof this._tr.render === 'function') {
    return normalize(this._tr.render(fs.readFileSync(filename, 'utf8'), options));
  } else {
    throw new Error('This transform does not support synchronous rendering');
  }
};
Transformer.prototype.renderFileAsync = function (filename, options, cb) {
  if (typeof this._tr.renderFileAsync === 'function') {
    return normalizeAsync(this._tr.renderFileAsync(filename, options), cb);
  } else if (typeof this._tr.renderFile === 'function') {
    return normalizeAsync(this._tr.renderFile(filename, options), cb);
  } else {
    return readFile(filename, 'utf8').then(function (str) {
      return this.renderAsync(str, options);
    }.bind(this)).then(normalize).nodeify(cb);
  }
};
