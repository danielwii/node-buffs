# node-buffs

[![travis-ci](https://travis-ci.org/danielwii/node-buffs.svg?branch=master)](https://travis-ci.org/danielwii/node-buffs)
[![codecov](https://codecov.io/gh/danielwii/node-buffs/branch/master/graph/badge.svg)](https://codecov.io/gh/danielwii/node-buffs)
[![Maintainability](https://api.codeclimate.com/v1/badges/7f78db8355785dfe34a4/maintainability)](https://codeclimate.com/github/danielwii/node-buffs/maintainability)
[![npm version](https://img.shields.io/npm/v/node-buffs.svg)](https://www.npmjs.com/package/node-buffs)
[![npm downloads](https://img.shields.io/npm/dt/node-buffs.svg)](https://www.npmjs.com/package/node-buffs)
[![Dependencies](https://img.shields.io/david/danielwii/node-buffs.svg?style=flat-square)](https://david-dm.org/danielwii/node-buffs)
[![license](https://img.shields.io/npm/l/node-buffs.svg)](https://www.npmjs.com/package/node-buffs)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)


[![NPM](https://nodei.co/npm/node-buffs.png?downloads=true&downloadRank=true)](https://nodei.co/npm/node-buffs/)
[![Package Quality](https://npm.packagequality.com/badge/node-buffs.png)](https://packagequality.com/#?package=node-buffs)

node useful toolkit.
封装了常用的 nodejs 工具包，如配置加载，加密和字符串转换等。

## Getting Started

```bash
yarn add node-buffs
```

```javascript
const { createConfigLoader } = require('node-buffs');
// or
import { createConfigLoader } from 'node-buffs';
```

## 模块

### ConfigLoader

一个灵活配置读取器，通过环境变量 `ENV` 加载对应的 [dotenv](https://github.com/motdotla/dotenv) 文件，也可通过预制的优先级覆盖配置。

* ENV=undefined -> .env
* ENV=local -> .env.local
* ENV=staging -> .env.staging


> 加载优先级：
> overwrite options -> process.env -> options(.env) -> optionsLoader -> default



e.g:

* **set required**, will throw exceptions at startup when variable cannot found in .env or environments

```javascript
import { createConfigLoader } from 'node-buffs';

// Load order:
// 1. load from overwrite options
// 2. load from process.env
// 3. load from .env
// 4. load from optionsLoader (json or function)
// 5. load from default

// lv4
export const configLoader = createConfigLoader({
  optionsLoader: { data: 'o.o' },
  requiredVariables: ['SECRET_KEY'],
});

// 具有最高的优先级 lv1
configLoader.setOverwriteOptions({
  highestOrder: '^_^',
});

// lv5
const key = configLoader.loadConfig('SECRET_KEY', 'default-secret');
const configs = configLoader.loadConfigs();
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/atom/atom/blob/master/LICENSE.md) file for details
