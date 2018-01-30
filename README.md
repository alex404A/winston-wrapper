# Winston Simple Wrapper

A simple wrapper for winston, which provides basic timestamp/label/level/color config

nodejs version: >=8.9.1

## Install

``` bash
# install dependencies
npm install --save winston-simple-wrapper
```

## Usage

``` javascript
const { Factory } = require('winston-simple-wrapper')
const logger = new Factory()
const obj = {a: 1}

logger.error('error' + obj, ['test', 'error'])
logger.warn(1)
logger.info(null, 'network')
logger.debug({
  a: 3,
  b: /123/,
  c: () => console.log(1),
  d: {
    a: [1, 'meme', obj],
    c: 3
  }
}, 'obj')
try {
  console.log(obj.a.b.c)
} catch (e) {
  logger.error(e, ['catch', 'error', 'obj'])
}
```

```
2018-1-30 19:57:24 error: [test,error] "error[object Object]"
2018-1-30 19:57:24 warn: [common] 1
2018-1-30 19:57:24 info: [network] null
2018-1-30 19:57:24 debug: [obj] {
  "a": 3,
  "b": "/123/",
  "c": "[Function] c",
  "d": {
    "a": [
      1,
      "meme",
      {
        "a": 1
      }
    ],
    "c": 3
  }
}
2018-1-30 19:57:24 error: [catch,error,obj]
Error message: Cannot read property 'c' of undefined
Error code: undefined
Error stack: TypeError: Cannot read property 'c' of undefined
    at Object.<anonymous> (/home/sixestates/test/log.js:25:23)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

## API

#### `Factory([config])`

- `config` (optional, *Object*) - If not provided, defaults to basic config, please refer to [winston](https://github.com/winstonjs/winston) to customize.

#### `logger.error(message, [labels])`

- `message` (*String*) - message info.
- `labels` (optional, *String/Array*) - message label, convenient to filter in log, common will be used if not provided

#### `logger.warn(message, [labels])`

- `message` (*String*) - message info.
- `labels` (optional, *String/Array*) - message label, convenient to filter in log, common will be used if not provided

#### `logger.info(message, [labels])`

- `message` (*String*) - message info.
- `labels` (optional, *String/Array*) - message label, convenient to filter in log, common will be used if not provided

#### `logger.verbose(message, [labels])`

- `message` (*String*) - message info.
- `labels` (optional, *String/Array*) - message label, convenient to filter in log, common will be used if not provided

#### `logger.debug(message, [labels])`

- `message` (*String*) - message info.
- `labels` (optional, *String/Array*) - message label, convenient to filter in log, common will be used if not provided

#### `logger.silly(message, [labels])`

- `message` (*String*) - message info.
- `labels` (optional, *String/Array*) - message label, convenient to filter in log, common will be used if not provided

