import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import frostConfig, { browserConfig, nodeConfig } from './../index.js';
import { hasRule, lintText } from './support.js';

describe('environment configs', () => {
    it('browserConfig exposes browser globals', async () => {
        const messages = await lintText('window.location.href;\n', [
            frostConfig,
            browserConfig,
        ]);

        assert.deepStrictEqual(messages, []);
    });

    it('nodeConfig exposes node globals', async () => {
        const messages = await lintText('process.env.NODE_ENV;\n', [
            frostConfig,
            nodeConfig,
        ]);

        assert.deepStrictEqual(messages, []);
    });
});

describe('base rules', () => {
    it('inherits the ESLint recommended rules', async () => {
        const messages = await lintText('missingReference;\n', [
            frostConfig,
        ]);

        assert.strictEqual(hasRule(messages, 'no-undef'), true);
    });

    it('disallows nested and unneeded ternaries', async () => {
        const nestedMessages = await lintText('const value = first ? second ? 1 : 2 : 3;\nvoid value;\n', [
            frostConfig,
        ]);
        const unneededMessages = await lintText('const value = condition ? true : false;\nvoid value;\n', [
            frostConfig,
        ]);

        assert.strictEqual(hasRule(nestedMessages, 'no-nested-ternary'), true);
        assert.strictEqual(hasRule(unneededMessages, 'no-unneeded-ternary'), true);
    });

    it('no-unused-vars only ignores names that start with an underscore', async () => {
        const allowedMessages = await lintText('function example(_unusedArg) { return 1; }\nexample();\n', [
            frostConfig,
        ]);
        const disallowedMessages = await lintText('function example(unused_arg) { return 1; }\nexample();\n', [
            frostConfig,
        ]);

        assert.strictEqual(hasRule(allowedMessages, 'no-unused-vars'), false);
        assert.strictEqual(hasRule(disallowedMessages, 'no-unused-vars'), true);
    });

    it('requires JSDoc for exported functions and methods, but not internal functions', async () => {
        const declarationMessages = await lintText('export function example() {}\n', [
            frostConfig,
        ]);
        const arrowMessages = await lintText('export const example = () => {};\n', [
            frostConfig,
        ]);
        const expressionMessages = await lintText('export const example = function() {};\n', [
            frostConfig,
        ]);
        const methodMessages = await lintText(`export class Example {
    method() {}
}
`, [
            frostConfig,
        ]);
        const internalMessages = await lintText(`function declaration() {}
const arrow = () => {};
const expression = function() {};
class Example {
    method() {}
}

declaration();
arrow();
expression();
new Example().method();
`, [
            frostConfig,
        ]);
        const objectMethodMessages = await lintText(`export const example = {
    method() {},
};
`, [
            frostConfig,
        ]);
        const nestedMessages = await lintText(`/** Run the example. */
export function example() {
    const nested = () => {};
    nested();
}
`, [
            frostConfig,
        ]);

        assert.strictEqual(hasRule(declarationMessages, 'jsdoc/require-jsdoc'), true);
        assert.strictEqual(hasRule(arrowMessages, 'jsdoc/require-jsdoc'), true);
        assert.strictEqual(hasRule(expressionMessages, 'jsdoc/require-jsdoc'), true);
        assert.strictEqual(hasRule(methodMessages, 'jsdoc/require-jsdoc'), true);
        assert.strictEqual(hasRule(internalMessages, 'jsdoc/require-jsdoc'), false);
        assert.strictEqual(hasRule(objectMethodMessages, 'jsdoc/require-jsdoc'), false);
        assert.strictEqual(hasRule(nestedMessages, 'jsdoc/require-jsdoc'), false);
    });

    it('prefers file-level JSDoc imports over inline imports', async () => {
        const inlineMessages = await lintText(`/**
 * Read a config.
 * @param {import('eslint').Linter.Config} config The config to read.
 */
export function readConfig(config) {
    void config;
}
`, [
            frostConfig,
        ]);
        const importTagMessages = await lintText(`/** @import { Linter } from 'eslint'; */

/**
 * Read a config.
 * @param {Linter.Config} config The config to read.
 */
export function readConfig(config) {
    void config;
}
`, [
            frostConfig,
        ]);

        assert.strictEqual(hasRule(inlineMessages, 'jsdoc/prefer-import-tag'), true);
        assert.strictEqual(hasRule(importTagMessages, 'jsdoc/prefer-import-tag'), false);
    });

    it('enforces import declaration ordering', async () => {
        const allowedMessages = await lintText(`import fs from 'node:fs';
import react from 'react';
import parent from '../parent.js';
import sibling from './sibling.js';
import './styles.css';

void fs;
void react;
void parent;
void sibling;
`, [
            frostConfig,
        ]);
        const disallowedMessages = await lintText(`import sibling from './sibling.js';
import fs from 'node:fs';
import react from 'react';

void fs;
void react;
void sibling;
`, [
            frostConfig,
        ]);

        assert.strictEqual(hasRule(allowedMessages, 'perfectionist/sort-imports'), false);
        assert.strictEqual(hasRule(disallowedMessages, 'perfectionist/sort-imports'), true);
    });

    it('enforces natural ordering for named imports', async () => {
        const allowedMessages = await lintText(`import { _alpha, beta, item2, item10 } from 'example';

void _alpha;
void beta;
void item2;
void item10;
`, [
            frostConfig,
        ]);
        const disallowedMessages = await lintText(`import { beta, alpha } from 'example';

void alpha;
void beta;
`, [
            frostConfig,
        ]);
        const disallowedSpacingMessages = await lintText(`import {
    alpha,

    beta,
} from 'example';

void alpha;
void beta;
`, [
            frostConfig,
        ]);

        assert.strictEqual(hasRule(allowedMessages, 'perfectionist/sort-named-imports'), false);
        assert.strictEqual(hasRule(disallowedMessages, 'perfectionist/sort-named-imports'), true);
        assert.strictEqual(hasRule(disallowedSpacingMessages, 'perfectionist/sort-named-imports'), true);
    });

    it('enforces re-export declaration ordering', async () => {
        const allowedMessages = await lintText(`export { alpha } from './alpha.js';
export { beta } from './beta.js';
`, [
            frostConfig,
        ]);
        const disallowedMessages = await lintText(`export { beta } from './beta.js';
export { alpha } from './alpha.js';
`, [
            frostConfig,
        ]);

        assert.strictEqual(hasRule(allowedMessages, 'perfectionist/sort-exports'), false);
        assert.strictEqual(hasRule(disallowedMessages, 'perfectionist/sort-exports'), true);
    });

    it('enforces class member order and spacing for static props, props, static methods, constructor, and methods', async () => {
        const allowedMessages = await lintText(`class Example {
    static alpha = 1;
    static omega = 2;

    alpha = 1;
    zeta = 2;

    static beta() {}

    constructor() {}

    alphaMethod() {}

    beta() {}
}

void Example;
`, [
            frostConfig,
        ]);
        const disallowedMessages = await lintText(`class Example {
    static alpha = 1;
    static omega = 2;

    static beta() {}

    alpha = 1;
    zeta = 2;

    constructor() {}

    alphaMethod() {}
    beta() {}
}

void Example;
`, [
            frostConfig,
        ]);
        const missingMethodSpacingMessages = await lintText(`class Example {
    static alpha = 1;
    static omega = 2;

    alpha = 1;
    zeta = 2;

    static beta() {}

    constructor() {}

    alphaMethod() {}
    beta() {}
}

void Example;
`, [
            frostConfig,
        ]);

        assert.deepStrictEqual(allowedMessages, []);
        assert.strictEqual(hasRule(disallowedMessages, 'perfectionist/sort-classes'), true);
        assert.strictEqual(hasRule(missingMethodSpacingMessages, 'perfectionist/sort-classes'), true);
    });

    it('enforces class member order and spacing for private static and private instance members', async () => {
        const allowedMessages = await lintText(`class Example {
    static alpha = 1;
    static zeta = 2;

    static #gamma = 1;
    static #theta = 2;

    alpha = 1;
    omega = 2;

    #beta = 1;
    #eta = 2;

    static beta() {
        return this.#delta();
    }

    static #delta() {
        return this.#gamma + this.#theta;
    }

    constructor() {}

    gamma() {
        return this.#epsilon();
    }

    #epsilon() {
        return this.#beta + this.#eta;
    }
}

void Example;
`, [
            frostConfig,
        ]);
        const disallowedMessages = await lintText(`class Example {
    static alpha = 1;

    static beta() {}

    static #gamma = 1;

    alpha = 1;

    #beta = 1;

    static #delta() {}

    constructor() {}

    gamma() {}

    #epsilon() {}
}

void Example;
`, [
            frostConfig,
        ]);

        assert.deepStrictEqual(allowedMessages, []);
        assert.strictEqual(hasRule(disallowedMessages, 'perfectionist/sort-classes'), true);
    });
});
