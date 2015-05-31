# boilerplates

This is a boilerplate for new transformers.

What you need to do:

1. Add your name to `LICENSE.md` and `package.json`
2. Activate Travis CI and Coveralls.
3. Update module name in `package.json` and `README.md`
4. Let the fun begin!

# jstransformer-foo

[Foo](http://example.com) support for [JSTransformers](http://github.com/jstransformers).

[![Build Status](https://img.shields.io/travis/jstransformers/jstransformer-foo/master.svg)](https://travis-ci.org/jstransformers/jstransformer-foo)
[![Coverage Status](https://img.shields.io/coveralls/jstransformers/jstransformer-foo/master.svg)](https://coveralls.io/r/jstransformers/jstransformer-foo?branch=master)
[![Dependency Status](https://img.shields.io/david/jstransformers/jstransformer-foo/master.svg)](http://david-dm.org/jstransformers/jstransformer-foo)
[![NPM version](https://img.shields.io/npm/v/jstransformer-foo.svg)](https://www.npmjs.org/package/jstransformer-foo)

## Installation

    npm install jstransformer-foo

## API

```js
var foo = require('jstransformer')(require('jstransformer-foo'))

foo.render('blah').body
//=> 'blah'
```

## License

MIT
