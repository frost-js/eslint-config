import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
import { describe, it } from 'mocha';
import frostConfig, { browserConfig, nodeConfig } from './../index.js';

async function lintText(source, config) {
    const eslint = new ESLint({
        overrideConfig: config,
        overrideConfigFile: true,
    });

    const [result] = await eslint.lintText(source, {
        filePath: 'fixture.js',
    });

    return result.messages;
}

function hasRule(messages, ruleId) {
    return messages.some((message) => message.ruleId === ruleId);
}

describe('environment configs', function() {
    this.timeout(10000);

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

describe('base rules', function() {
    this.timeout(10000);

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
