# JSTransformer Boilerplate

Use JSTransformer Boilerplate to create and update transformers.

1. Visit [the Boilerplate Wiki](https://github.com/jstransformers/boilerplate/wiki) on how to get started
2. Remove this top notice from any transformers

# jstransformer-foo

[Foo](http://example.com) support for [JSTransformers](http://github.com/jstransformers).

[![Build Status](https://img.shields.io/travis/jstransformers/jstransformer-foo/master.svg)](https://travis-ci.org/jstransformers/jstransformer-foo)
[![Coverage Status](https://img.shields.io/codecov/c/github/jstransformers/jstransformer-foo/master.svg)](https://codecov.io/gh/jstransformers/jstransformer-foo)
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
