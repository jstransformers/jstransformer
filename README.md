
<p align="center"><img src="https://cdn.rawgit.com/jstransformers/jstransformer/2bb6dc6c410e8683a17a4af5f1b73bcbee95aada/logo.svg" width="300px" height="299px" /></p>
<h1 align="center">JSTransformer</h1>
<p align="center">Normalize the API of any jstransformer</p>

<p align="center"><a href="https://travis-ci.org/jstransformers/jstransformer"><img src="https://img.shields.io/travis/jstransformers/jstransformer/master.svg" alt="Build Status"></a>
<a href="https://david-dm.org/jstransformers/jstransformer"><img src="https://img.shields.io/david/jstransformers/jstransformer.svg" alt="Dependency Status"></a>
<a href="https://david-dm.org/jstransformers/jstransformer#info=devDependencies"><img src="https://img.shields.io/david/dev/jstransformers/jstransformer.svg" alt="Developers' Dependency Status"></a>
<a href="https://coveralls.io/r/jstransformers/jstransformer?branch=master"><img src="https://img.shields.io/coveralls/jstransformers/jstransformer/master.svg" alt="Coverage Status"></a>
<a href="https://www.npmjs.org/package/jstransformer"><img src="https://img.shields.io/npm/v/jstransformer.svg" alt="NPM version"></a></p>


## Installation

```
npm install jstransformer --save
```

## Usage

```js
var transformer = require('jstransformer');
var marked = transformer(require('jstransformer-marked'));

var options = {};
var res = marked.render('Some **markdown**', options);
//=> {body: 'Some <strong>markdown</strong>', dependencies: []}
```

This gives the same API regardless of the jstransformer passed in.

## API
A transformer, once normalised using this module, will implement the following methods. Note that if the underlying transformer cannot be used to implement the functionality, it may ultimately just throw an error.


### Returned object from `.compile*`
```js
{fn: Function, dependencies: Array.<String>}
```

 - `fn` represents the render function, which also accept `locals`
 - `dependencies` is an array of files that were read in as part of the compile process (or an empty array if there were no dependencies)


### .compile
Compile a given string and return an object.

**Params**
- `<str>` **{String}** string to compile
- `[options]` **{Object}** optional options to pass to
- `returns` **{Object}**

**Requires the underlying transform to implement one of following methods**
- `.compile`
- `.render`

**Example**

```js
transformer.compile(str, options);
//=> {fn: Function, dependencies: Array.<String>}
```


### .compileAsync
Compile a string asynchronously.

**Params**
- `<str>` **{String}** string to compile
- `[options]` **{Object}** optional options to pass to
- `[callback]` **{Function}** if not given, returns Promise
- `returns` **{Promise}**

**Requires the underlying transform to implement one of following methods**
- `.compileAsync`
- `.compile`
- `.render`

**Example**

```js
transformer.compileAsync(str, options).then(function (res) {
  //=> {fn: Function, dependencies: Array.<String>}
});
```


### .compileFile
Compile a string from a given `filepath` synchronously.

**Params**
- `<filepath>` **{String}** path to file to compile
- `[options]` **{Object}** optional options to pass to
- `returns` **{Object}**

**Requires the underlying transform to implement one of following methods**
- `.compileFile`
- `.compile`
- `.renderFile`
- `.render`

**Example**

```js
transformer.compileFile(filepath, options);
//=> {fn: Function, dependencies: Array.<String>}
```


### .compileFileAsync
Compile a string from `filepath` asynchronously.

**Params**
- `<filepath>` **{String}** path to file to compile
- `[options]` **{Object}** optional options to pass to
- `[callback]` **{Function}** if not given, returns Promise
- `returns` **{Promise}**

**Requires the underlying transform to implement one of following methods**
- `.compileFileAsync`
- `.compileFile`
- `.compileAsync`
- `.compile`
- `.renderFile`
- `.render`

**Example**

```js
transformer.compileFileAsync(filepath, options).then(function (res) {
  //=> {fn: Function, dependencies: Array.<String>}
});
```


***


### Returned object from `.render*`
```js
{body: String, dependencies: Array.<String>}
```

 - `body` represents the result as a string
 - `dependencies` is an array of files that were read in as part of the render process (or an empty array if there were no dependencies)


### .render
Render a given string and return an object.

**Params**
- `<str>` **{String}** string to render
- `[options]` **{Object}** optional options to pass to
- `[locals]` **{Object}** template context, also known as locals
- `returns` **{Object}**

**Requires the underlying transform to implement one of following methods**
- `.compile`
- `.render`

**Example**

```js
transformer.render(str, options, locals);
//=> {body: String, dependencies: Array.<String>}
```


### .renderAsync
Render a string asynchronously.

**Params**
- `<str>` **{String}** string to compile
- `[options]` **{Object}** optional options to pass to
- `[locals]` **{Object}** template context, also known as locals
- `[callback]` **{Function}** if not given, returns Promise
- `returns` **{Promise}**

**Requires the underlying transform to implement one of following methods**
- `.renderAsync`
- `.render`
- `.compileAsync`
- `.compile`

**Example**

```js
transformer.renderAsync(str, options, locals).then(function (res) {
  //=> {fn: Function, dependencies: Array.<String>}
});
```


### .renderFile
Render a string from a given `filepath` synchronously.

**Params**
- `<filepath>` **{String}** path to file to compile
- `[options]` **{Object}** optional options to pass to
- `[locals]` **{Object}** template context, also known as locals
- `returns` **{Object}**

**Requires the underlying transform to implement one of following methods**
- `.renderFile`
- `.render`
- `.compileFile`
- `.compile`

**Example**

```js
transformer.renderFile(filepath, options, locals);
//=> {fn: Function, dependencies: Array.<String>}
```


### .renderFileAsync
Compile a string from `filepath` asynchronously.

**Params**
- `<filepath>` **{String}** path to file to compile
- `[options]` **{Object}** optional options to pass to
- `[locals]` **{Object}** template context, also known as locals
- `[callback]` **{Function}** if not given, returns Promise
- `returns` **{Promise}**

**Requires the underlying transform to implement one of following methods**
- `.renderFileAsync`
- `.renderFile`
- `.render`
- `.compileAsync`
- `.compileFile`
- `.compile`

**Example**

```js
transformer.renderFileAsync(filepath, options, locals).then(function (res) {
  //=> {fn: Function, dependencies: Array.<String>}
});
```


***


### .inputFormats

Returns an array of strings representing potential input formats for the transform. If not provided directly by the transform, results in an array containing the name of the transform.

**Example**

```js
var hbs = require('jstransformer')(require('jstransformer-handlebars'))
var formats = hbs.inputFormats;
//=> ['hbs', 'handlebars']
```


### .outputFormat

Returns a string representing the default output format the transform would be expected to return when calling `.render()`.

**Example**

```js
var hbs = require('jstransformer')(require('jstransformer-handlebars'))
var formats = hbs.outputFormat;
//=> 'html'
```


## License

MIT
