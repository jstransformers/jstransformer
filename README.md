# jstransformer

Normalize the API of any jstransformer

[![Build Status](https://img.shields.io/travis/jstransformers/jstransformer/master.svg)](https://travis-ci.org/jstransformers/jstransformer)
[![Dependency Status](https://img.shields.io/gemnasium/jstransformers/jstransformer.svg)](https://gemnasium.com/jstransformers/jstransformer)
[![NPM version](https://img.shields.io/npm/v/jstransformer.svg)](https://www.npmjs.org/package/jstransformer)

## Installation

    npm install jstransformer

## Usage

```js
var transformer = require('jstransformer');
var marked = transformer(require('jstransformer-marked'));

var options = {};
var res = marked.render('Some **markdown**', options);
// => {body: 'Some <strong>markdown</strong>', dependencies: []}
```

This gives the same API regardless of the jstransformer passed in.

## API

A transformer, once normalised using this module, will implement the following methods.  Note that if the underlying transformer cannot be used to implement the functionality, it may ultimately just throw an error.

### `.render`

```js
transformer.render(str, options);
=> {body: String, dependencies: Array.<String>}
```

_requires the underlying transform to implement `.render`_

Transform a string and return an object where:

 - `body` represents the result as a string
 - `dependencies` is an array of files that were read in as part of the render process (or an empty array if there were no dependencies)

### `.renderAsync`

```js
transformer.renderAsync(str, options, callback);
```

```js
transformer.renderAsync(str, options);
=> Promise({body: String, dependencies: Array.<String>})
```

_requires the underlying transform to implement `.renderAsync` or `.render`_

Transform a string asynchronously and return an object where:

 - `body` represents the result as a string
 - `dependencies` is an array of files that were read in as part of the render process (or an empty array if there were no dependencies)

If a callback is provided, it is called with the error followed by the result, otherwise a Promise is returned.

### `.renderFile`

```js
transformer.renderFile(filename, options)
=> {body: String, dependencies: Array.<String>}
```

_requires the underlying transform to implement `.renderFile` or `.render`_

Transform a file and return an object where:

 - `body` represents the result as a string
 - `dependencies` is an array of files that were read in as part of the render process (or an empty array if there were no dependencies).  This does not include the initial file being rendered.

### `.renderFileAsync`

```js
transformer.renderFileAsync(filename, options, callback);
```

```js
transformer.renderFileAsync(filename, options);
=> Promise({body: String, dependencies: Array.<String>})
```

_requires the underlying transform to implement `.renderFileAsync`, `.renderFile`, `.renderAsync` or `.render`_

Transform a file and return an object where:

 - `body` represents the result as a string
 - `dependencies` is an array of files that were read in as part of the render process (or an empty array if there were no dependencies).  This does not include the initial file being rendered.

If a callback is provided, it is called with the error followed by the result, otherwise a Promise is returned.

## License

  MIT
