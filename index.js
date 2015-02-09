'use strict';

var fs = require('fs');
var assert = require('assert');
var Promise = require('promise');

var tr = (module.exports = function (transformer) {
  return new Transformer(transformer);
});
tr.Transformer = Transformer;
tr.normalizeFn = normalizeFn;
tr.normalizeFnAsync = normalizeFnAsync;
tr.normalize = normalize;
tr.normalizeAsync = normalizeAsync;
tr.readFile = Promise.denodeify(fs.readFile);
tr.readFileSync = fs.readFileSync;

function isPromise(value) {
  return value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
}
function normalizeFn(result) {
  if (typeof result === 'function') {
    return {fn: result, dependencies: []};
  } else if (result && typeof result === 'object' && typeof result.fn === 'function') {
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
function normalizeFnAsync(result, cb) {
  return Promise.resolve(result).then(function (result) {
    if (result && isPromise(result.fn)) {
      return result.fn.then(function (fn) {
        result.fn = fn;
        return result;
      });
    }
    return result;
  }).then(tr.normalizeFn).nodeify(cb);
}
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
  return Promise.resolve(result).then(function (result) {
    if (result && isPromise(result.body)) {
      return result.body.then(function (body) {
        result.body = body;
        return result;
      });
    }
    return result;
  }).then(tr.normalize).nodeify(cb);
}

function Transformer(tr) {
  assert(tr, 'Transformer must be an object');
  assert(typeof tr.name === 'string', 'Transformer must have a name');
  assert(typeof tr.outputFormat === 'string', 'Transformer must have an output format');
  assert([
    'compile',
    'compileAsync',
    'compileFile',
    'compileFileAsync',
    'compileClient',
    'compileClientAsync',
    'compileFileClient',
    'compileFileClientAsync',
    'render',
    'renderAsync',
    'renderFile',
    'renderFileAsync'
  ].some(function (method) {
    return typeof tr[method] === 'function';
  }), 'Transformer must implement at least one of the potential methods.');
  this._tr = tr;
  this.name = this._tr.name;
  this.outputFormat = this._tr.outputFormat;
}

Transformer.prototype._hasMethod = function (method) {
  return typeof this._tr[method] === 'function';
};

/* COMPILE */

Transformer.prototype.compile = function (str, options) {
  if (this._hasMethod('compile')) {
    return tr.normalizeFn(this._tr.compile(str, options));
  } else {
    throw new Error('This transform does not support synchronous compiling of plain strings');
  }
};
Transformer.prototype.compileAsync = function (str, options, cb) {
  if (this._hasMethod('compileAsync')) {
    return tr.normalizeFnAsync(this._tr.compileAsync(str, options), cb);
  } else if (this._hasMethod('compile')) {
    return tr.normalizeFnAsync(this._tr.compile(str, options), cb);
  } else {
    return Promise.reject(new Error('This transform does not support compiling plain strings')).nodeify(cb);
  }
};
Transformer.prototype.compileFile = function (filename, options) {
  if (this._hasMethod('compileFile')) {
    return tr.normalizeFn(this._tr.compileFile(filename, options));
  } else if (this._hasMethod('compile')) {
    return tr.normalizeFn(this._tr.compile(tr.readFileSync(filename, 'utf8'), options));
  } else {
    throw new Error('This transform does not support synchronous compiling');
  }
};
Transformer.prototype.compileFileAsync = function (filename, options, cb) {
  if (this._hasMethod('compileFileAsync')) {
    return tr.normalizeFnAsync(this._tr.compileFileAsync(filename, options), cb);
  } else if (this._hasMethod('compileFile')) {
    return tr.normalizeFnAsync(this._tr.compileFile(filename, options), cb);
  } else {
    return tr.normalizeFnAsync(tr.readFile(filename, 'utf8').then(function (str) {
      if (this._hasMethod('compileAsync')) {
        return this._tr.compileAsync(str, options);
      } else if (this._hasMethod('compile')) {
        return this._tr.compile(str, options);
      } else {
        throw new Error('Transform does not support compiling');
      }
    }.bind(this)), cb);
  }
};

/* COMPILE CLIENT */


Transformer.prototype.compileClient = function (str, options) {
  if (this._hasMethod('compileClient')) {
    return tr.normalize(this._tr.compileClient(str, options));
  } else {
    throw new Error('This transform does not support compile client plain strings');
  }
};
Transformer.prototype.compileClientAsync = function (str, options, cb) {
  if (this._hasMethod('compileClientAsync')) {
    return tr.normalizeAsync(this._tr.compileClientAsync(str, options), cb);
  } else if (this._hasMethod('compileClient')) {
    return tr.normalizeAsync(this._tr.compileClient(str, options), cb);
  } else {
    return Promise.reject(new Error('This transform does not support compile client'));
  }
};
Transformer.prototype.compileFileClient = function (filename, options) {
  if (this._hasMethod('compileFileClient')) {
    return tr.normalize(this._tr.compileFileClient(filename, options));
  } else if (this._hasMethod('compileClient')) {
    return tr.normalize(this._tr.compileClient(tr.readFileSync(filename, 'utf8'), options));
  } else {
    throw new Error('This transform does not support synchronous compiling to client');
  }
};
Transformer.prototype.compileFileClientAsync = function (filename, options, cb) {
  if (this._hasMethod('compileFileClientAsync')) {
    return tr.normalizeAsync(this._tr.compileFileClientAsync(filename, options), cb);
  } else if (this._hasMethod('compileFileClient')) {
    return tr.normalizeAsync(this._tr.compileFileClient(filename, options), cb);
  } else {
    return tr.normalizeAsync(tr.readFile(filename, 'utf8').then(function (str) {
      if (this._hasMethod('compileClientAsync')) {
        return this._tr.compileClientAsync(str, options);
      } else if (this._hasMethod('compileClient')) {
        return this._tr.compileClient(str, options);
      } else {
        throw new Error('Transform does not support compileFileClientAsync');
      }
    }.bind(this)), cb);
  }
};

/* RENDER */

Transformer.prototype.render = function (str, options, locals) {
  if (this._hasMethod('render')) {
    return tr.normalize(this._tr.render(str, options, locals));
  } else if (this._hasMethod('compile')) {
    var compiled = tr.normalizeFn(this._tr.compile(str, options));
    var body = compiled.fn(options || locals);
    if (typeof body !== 'string') {
      throw new Error('This transform does not support synchronous rendering');
    }
    return tr.normalize({body: body, dependencies: compiled.dependencies});
  } else {
    throw new Error('This transform does not support rendering plain strings');
  }
};
Transformer.prototype.renderAsync = function (str, options, locals, cb) {
  if (typeof locals === 'function') {
    cb = locals;
    locals = options;
  }
  if (this._hasMethod('renderAsync')) {
    return tr.normalizeAsync(this._tr.renderAsync(str, options, locals), cb);
  } else if (this._hasMethod('render')) {
    return tr.normalizeAsync(this._tr.render(str, options, locals), cb);
  } else if (this._hasMethod('compile') || this._hasMethod('compileAsync')) {
    return tr.normalizeAsync(this.compileAsync(str, options).then(function (compiled) {
      return {body: compiled.fn(options || locals), dependencies: compiled.dependencies};
    }), cb);
  } else {
    return Promise.reject(new Error('This transform does not support rendering of plain strings'));
  }
};
Transformer.prototype.renderFile = function (filename, options, locals) {
  if (typeof this._tr.renderFile === 'function') {
    return tr.normalize(this._tr.renderFile(filename, options, locals));
  } else if (typeof this._tr.render === 'function') {
    return tr.normalize(this._tr.render(tr.readFileSync(filename, 'utf8'), options, locals));
  } else if (this._hasMethod('compile') || this._hasMethod('compileFile')) {
    var compiled = this.compileFile(filename, options);
    return tr.normalize({body: compiled.fn(options || locals), dependencies: compiled.dependencies});
  } else {
    return Promise.reject(new Error('This transform does not support synchronous rendering'));
  }
};
Transformer.prototype.renderFileAsync = function (filename, options, locals, cb) {
  if (typeof locals === 'function') {
    cb = locals;
    locals = options;
  }
  if (typeof this._tr.renderFileAsync === 'function') {
    return tr.normalizeAsync(this._tr.renderFileAsync(filename, options, locals), cb);
  } else if (typeof this._tr.renderFile === 'function') {
    return tr.normalizeAsync(this._tr.renderFile(filename, options, locals), cb);
  } else if (this._hasMethod('compile') || this._hasMethod('compileAsync')
             || this._hasMethod('compileFile') || this._hasMethod('compileFileAsync')) {
    return tr.normalizeAsync(this.compileFileAsync(filename, options).then(function (compiled) {
      return {body: compiled.fn(options || locals), dependencies: compiled.dependencies};
    }), cb);
  } else {
    return tr.normalizeAsync(tr.readFile(filename, 'utf8').then(function (str) {
      return this.renderAsync(str, options, locals);
    }.bind(this)), cb);
  }
};
