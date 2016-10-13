<p align="center"><img src="https://cdn.rawgit.com/jstransformers/jstransformer/2bb6dc6c410e8683a17a4af5f1b73bcbee95aada/logo.svg" width="300px" height="299px" /></p>
<h1 align="center">JSTransformer</h1>
<p align="center">Normalize the API of any jstransformer</p>

<p align="center"><a href="https://travis-ci.org/jstransformers/jstransformer"><img src="https://img.shields.io/travis/jstransformers/jstransformer/master.svg" alt="Build Status"></a>
<a href="https://david-dm.org/jstransformers/jstransformer"><img src="https://img.shields.io/david/jstransformers/jstransformer.svg" alt="Dependency Status"></a>
<a href="https://david-dm.org/jstransformers/jstransformer#info=devDependencies"><img src="https://img.shields.io/david/dev/jstransformers/jstransformer.svg" alt="Developers' Dependency Status"></a>
<a href="https://coveralls.io/r/jstransformers/jstransformer?branch=master"><img src="https://img.shields.io/coveralls/jstransformers/jstransformer/master.svg" alt="Coverage Status"></a>
<a href="https://www.npmjs.org/package/jstransformer"><img src="https://img.shields.io/npm/v/jstransformer.svg" alt="NPM version"></a></p>

There are many good template engines and compilers written for Node.js. But there is a problem: all of them have slightly different APIs, requiring slightly different usage. JSTransformer unifies them into one standardized API. Code written for one transformer will work with any other transformer. There are over 100 transformers, ranging from Markdown parsers to template engines to code compilers. You can view the full list [here](https://www.npmjs.com/browse/keyword/jstransformer).

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

### `.render*`

#### Returned object from `.render*`

```js
{body: String, dependencies: Array.<String>}
```

 - `body` represents the result as a string
 - `dependencies` is an array of file names that were read in as part of the render process (or an empty array if there were no dependencies)

#### `.render`

```js
transformer.render(str, options, locals);
=> {body: String, dependencies: Array.<String>}
```

_requires the underlying transform to implement `.render` or `.compile`_

Transform a string and return an object.

#### `.renderAsync`

```js
transformer.renderAsync(str[, options], locals, callback);
```

```js
transformer.renderAsync(str[, options], locals);
=> Promise({body: String, dependencies: Array.<String>})
```

_requires the underlying transform to implement `.renderAsync`, `.render`, `.compile`, or `.compileAsync`_

Transform a string asynchronously. If a callback is provided, it is called as `callback(err, data)`, otherwise a Promise is returned.

#### `.renderFile`

```js
transformer.renderFile(filename, options, locals)
=> {body: String, dependencies: Array.<String>}
```

_requires the underlying transform to implement `.renderFile`, `.render`, `.compileFile`, or `.compile`_

Transform a file and return an object.

#### `.renderFileAsync`

```js
transformer.renderFileAsync(filename[, options], locals, callback);
```

```js
transformer.renderFileAsync(filename[, options], locals);
=> Promise({body: String, dependencies: Array.<String>})
```

_requires the underlying transform to implement `.renderFileAsync`, `.renderFile`, `.renderAsync`, `.render`, `.compileFileAsync`, `.compileFile`, `.compileAsync`, or `.compile`_

Transform a file asynchronously. If a callback is provided, it is called as `callback(err, data)`, otherwise a Promise is returned.

### `.compile*`

#### Returned object from `.compile*`

```js
{fn: Function, dependencies: Array.<String>}
```

 - `fn` is a function that takes a locals object and returns the rendered template as a string.
 - `dependencies` is an array of file names that were read in as part of the compilation process (or an empty array if there were no dependencies)

#### `.compile`

```js
transformer.compile(str[, options]);
=> {fn: Function, dependencies: Array.<String>}
```

_requires the underlying transform to implement `.compile` or `.render`_

Compile a string and return an object.

#### `.compileAsync`

```js
transformer.compileAsync(str[, options], callback);
```

```js
transformer.compileAsync(str[, options]);
=> Promise({fn: Function, dependencies: Array.<String>})
```

_requires the underlying transform to implement `.compileAsync`, `.compile` or `.render`_

Compile a string asynchronously. If a callback is provided, it is called as `callback(err, data)`, otherwise a Promise is returned.

#### `.compileFile`

```js
transformer.compileFile(filename[, options])
=> {fn: Function, dependencies: Array.<String>}
```

_requires the underlying transform to implement `.compileFile`, `.compile`, `.renderFile`, or `.render`_

Compile a file and return an object.

#### `.compileFileAsync`

```js
transformer.compileFileAsync(filename[, options], callback);
```

```js
transformer.compileFileAsync(filename[, options]);
=> Promise({fn: Function, dependencies: Array.<String>})
```

_requires the underlying transform to implement `.compileFileAsync`, `.compileFile`, `.compileAsync`, `.compile`, `.renderFileAsync`, `.renderFile`, or `.render`_

Compile a file asynchronously. If a callback is provided, it is called as `callback(err, data)`, otherwise a Promise is returned.

### `.compileClient*`

#### Returned object from `.compileClient*`

```js
{body: String, dependencies: Array.<String>}
```

 - `body` is a `.toString`ed function that can be used on the client side.
 - `dependencies` is an array of file names that were read in as part of the compilation process (or an empty array if there were no dependencies)

#### `.compileClient`

```js
transformer.compileClient(str[, options]);
=> {body: String, dependencies: Array.<String>}
```

_requires the underlying transform to implement `.compileClient`_

Compile a string for client-side use and return an object.

#### `.compileClientAsync`

```js
transformer.compileClientAsync(str[, options], callback);
```

```js
transformer.compileClientAsync(str[, options]);
=> Promise({body: String, dependencies: Array.<String>})
```

_requires the underlying transform to implement `.compileClientAsync` or `.compileClient`_

Compile a string for client-side use asynchronously. If a callback is provided, it is called as `callback(err, data)`, otherwise a Promise is returned.

#### `.compileFileClient`

```js
transformer.compileFileClient(filename[, options])
=> {body: String, dependencies: Array.<String>}
```

_requires the underlying transform to implement `.compileFileClient` or `.compileClient`_

Compile a file for client-side use and return an object.

#### `.compileFileClientAsync`

```js
transformer.compileFileClientAsync(filename[, options], callback);
```

```js
transformer.compileFileClientAsync(filename[, options]);
=> Promise({body: String, dependencies: Array.<String>})
```

_requires the underlying transform to implement `.compileFileClientAsync`, `.compileFileClient`, `.compileClientAsync`, or `.compileClient`_

Compile a file for client-side use asynchronously. If a callback is provided, it is called as `callback(err, data)`, otherwise a Promise is returned.

### `.inputFormats`

```js
var formats = transformer.inputFormats;
=> ['md', 'markdown']
```

Returns an array of strings representing potential input formats for the transform. If not provided directly by the transform, results in an array containing the name of the transform.

### `.outputFormat`

```js
var md = require('jstransformer')(require('jstransformer-markdown'))
var outputFormat = md.outputFormat
=> 'html'
```

Returns a string representing the default output format the transform would be expected to return when calling `.render()`.

### `.can`

```js
var md = require('jstransformer')(require('jstransformer-markdown'))
md.can('render');
=> true
```

Takes a method name as a string and returns a boolean value indicating whether the normalised transform implements this method.

## License

MIT
