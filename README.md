# Frost ESLint Config

[![CI](https://github.com/frost-js/eslint-config/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/frost-js/eslint-config/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/%40fr0st%2Feslint-config?style=flat-square)](https://www.npmjs.com/package/@fr0st/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/%40fr0st%2Feslint-config?style=flat-square)](https://www.npmjs.com/package/@fr0st/eslint-config)
[![license](https://img.shields.io/github/license/frost-js/eslint-config?style=flat-square)](./LICENSE)

ESLint shareable config for the *Frost* style.

## Installation

```bash
npm i -D @fr0st/eslint-config eslint
```

## Usage

Browser projects:

```js
import frostConfig, { browserConfig } from '@fr0st/eslint-config';

export default [
    frostConfig,
    browserConfig,
];
```

Node projects:

```js
import frostConfig, { nodeConfig } from '@fr0st/eslint-config';

export default [
    frostConfig,
    nodeConfig,
];
```

If you want to scope the config to specific files, wrap it in your own config object:

```js
import frostConfig, { nodeConfig } from '@fr0st/eslint-config';

export default [
    {
        ...frostConfig,
        files: ['**/*.{js,mjs,cjs}'],
    },
    nodeConfig,
];
```

The base config enforces four-space indentation, single quotes, constructor parentheses, shorthand properties, and arrow callbacks where a regular function is not needed. Equality comparisons use `===` and `!==`, with `value == null` and `value != null` allowed for nullish checks.

Use `Number(value)`, `Boolean(value)`, and `String(value)` for explicit conversions, and test truthiness directly in conditions. Use `Number(value)` for complete numeric values, `Number.isInteger` to validate whole numbers, and `Math.trunc` to truncate an existing number.

Use `Number.parseFloat` for intentional numeric-prefix parsing, such as CSS values ending in `px` or `s`. Use `Number.parseInt` for intentional integer-prefix parsing or a specific radix. Choose the radix for the input format and preserve existing inferred-radix behavior when refactoring. These parsers intentionally accept trailing text and should remain distinct from `Number(value)`.

Use template literals to compose strings. Existing template coercion can also remain where rejecting Symbol values is part of the behavior, because `String(value)` accepts Symbols.

## Compatibility

- Node: `^20.19.0 || ^22.13.0 || >=24`
- ESLint: `^10.0.0`

## Development

Install dependencies with `npm ci`.

```bash
npm test
npm run lint
```

`npm test` runs the Vitest suite against the shared config.

## License

Frost ESLint Config is released under the [MIT License](./LICENSE).
