import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';

const rules = {
    ...js.configs.recommended.rules,
    '@stylistic/array-bracket-newline': 'off',
    '@stylistic/array-bracket-spacing': [
        'error',
        'never',
    ],
    '@stylistic/array-element-newline': 'off',
    '@stylistic/arrow-parens': [
        'error',
        'always',
    ],
    '@stylistic/block-spacing': [
        'error',
        'never',
    ],
    '@stylistic/brace-style': 'error',
    '@stylistic/comma-dangle': [
        'error',
        'always-multiline',
    ],
    '@stylistic/comma-spacing': 'error',
    '@stylistic/comma-style': 'error',
    '@stylistic/computed-property-spacing': 'error',
    '@stylistic/eol-last': 'error',
    '@stylistic/function-call-spacing': 'error',
    '@stylistic/indent': [
        'error',
        4,
        {
            MemberExpression: 'off',
            SwitchCase: 1,
        },
    ],
    '@stylistic/key-spacing': 'error',
    '@stylistic/keyword-spacing': 'error',
    '@stylistic/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': [
        'error',
        {
            max: 2,
        },
    ],
    '@stylistic/no-tabs': 'error',
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/object-curly-spacing': [
        'error',
        'always',
    ],
    '@stylistic/operator-linebreak': [
        'error',
        'after',
    ],
    '@stylistic/padded-blocks': [
        'error',
        'never',
    ],
    '@stylistic/quote-props': [
        'error',
        'consistent',
    ],
    '@stylistic/quotes': [
        'error',
        'single',
        {
            allowTemplateLiterals: 'always',
        },
    ],
    '@stylistic/rest-spread-spacing': 'error',
    '@stylistic/semi': 'error',
    '@stylistic/semi-spacing': 'error',
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/space-before-function-paren': [
        'error',
        {
            asyncArrow: 'always',
            anonymous: 'never',
            named: 'never',
        },
    ],
    '@stylistic/spaced-comment': [
        'error',
        'always',
    ],
    '@stylistic/switch-colon-spacing': 'error',
    '@stylistic/yield-star-spacing': [
        'error',
        'after',
    ],
    'camelcase': [
        'error',
        {
            properties: 'never',
        },
    ],
    'curly': [
        'error',
        'multi-line',
    ],
    'guard-for-in': 'error',
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-property-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'error',
    'jsdoc/empty-tags': 'error',
    'jsdoc/prefer-import-tag': [
        'error',
        {
            enableFixer: true,
            exemptTypedefs: false,
            outputType: 'named-import',
        },
    ],
    'jsdoc/require-jsdoc': [
        'error',
        {
            publicOnly: true,
            require: {
                ArrowFunctionExpression: true,
                FunctionDeclaration: true,
                FunctionExpression: true,
                MethodDefinition: true,
            },
        },
    ],
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-property': 'error',
    'jsdoc/require-property-description': 'error',
    'jsdoc/require-property-name': 'error',
    'jsdoc/require-property-type': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-check': 'error',
    'jsdoc/require-returns-description': 'error',
    'jsdoc/require-returns-type': 'error',
    'jsdoc/require-throws-description': 'error',
    'jsdoc/require-throws-type': 'error',
    'jsdoc/valid-types': 'error',
    'new-cap': 'error',
    'no-array-constructor': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'off',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-invalid-this': 'off',
    'no-multi-str': 'error',
    'no-nested-ternary': 'error',
    'no-new-object': 'error',
    'no-new-symbol': 'error',
    'no-new-wrappers': 'error',
    'no-throw-literal': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-vars': [
        'error',
        {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
        },
    ],
    'no-var': 'error',
    'one-var': [
        'error',
        {
            const: 'never',
            let: 'never',
            var: 'never',
        },
    ],
    'perfectionist/sort-classes': [
        'error',
        {
            groups: [
                {
                    group: [
                        'static-property',
                        'static-accessor-property',
                        'static-function-property',
                    ],
                    newlinesInside: 0,
                },
                {
                    group: [
                        'private-static-property',
                        'private-static-accessor-property',
                        'private-static-function-property',
                    ],
                    newlinesInside: 0,
                },
                {
                    group: [
                        'property',
                        'accessor-property',
                        'function-property',
                    ],
                    newlinesInside: 0,
                },
                {
                    group: [
                        'private-property',
                        'private-accessor-property',
                        'private-function-property',
                    ],
                    newlinesInside: 0,
                },
                [
                    'static-get-method',
                    'static-set-method',
                ],
                [
                    'private-static-get-method',
                    'private-static-set-method',
                ],
                'static-method',
                'private-static-method',
                'constructor',
                [
                    'get-method',
                    'set-method',
                ],
                [
                    'private-get-method',
                    'private-set-method',
                ],
                'method',
                'private-method',
                'unknown',
            ],
            type: 'natural',
            newlinesBetween: 1,
            newlinesInside: 1,
        },
    ],
    'perfectionist/sort-exports': [
        'error',
        {
            type: 'natural',
            order: 'asc',
            newlinesBetween: 0,
        },
    ],
    'perfectionist/sort-imports': [
        'error',
        {
            groups: [
                'builtin',
                'external',
                'internal',
                [
                    'parent',
                    'sibling',
                    'index',
                ],
                'style',
            ],
            type: 'natural',
            order: 'asc',
            sortSideEffects: false,
            newlinesBetween: 0,
        },
    ],
    'perfectionist/sort-named-imports': [
        'error',
        {
            type: 'natural',
            order: 'asc',
            specialCharacters: 'trim',
            newlinesInside: 0,
        },
    ],
    'prefer-const': [
        'error',
        {
            destructuring: 'all',
        },
    ],
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
};

export const baseConfig = {
    name: '@fr0st/eslint-config/base',
    plugins: {
        jsdoc,
        perfectionist,
        '@stylistic': stylistic,
    },
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules,
};

export const browserConfig = {
    name: '@fr0st/eslint-config/browser',
    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },
};

export const nodeConfig = {
    name: '@fr0st/eslint-config/node',
    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
};

export default baseConfig;
