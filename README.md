# boilerplates

This is a boilerplate for new transformers.

Don't forget to activate Travis CI and Coveralls!!!

# jstransformer-foo

Transformer that converts a string to foo.

[![Build Status](https://img.shields.io/travis/jstransformers/jstransformer-foo/master.svg)](https://travis-ci.org/jstransformers/jstransformer-foo)
[![Coverage Status](https://img.shields.io/coveralls/jstransformers/jstransformer-foo/master.svg)](https://coveralls.io/r/jstransformers/jstransformer-foo?branch=master)
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
