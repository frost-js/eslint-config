import { ESLint } from 'eslint';

/**
 * Determine whether lint messages include a rule.
 * @param {import('eslint').Linter.LintMessage[]} messages The lint messages.
 * @param {string} ruleId The rule identifier to find.
 * @returns {boolean} Whether the rule is present.
 */
export function hasRule(messages, ruleId) {
    return messages.some((message) => message.ruleId === ruleId);
}

/**
 * Lint source text with the supplied flat config.
 * @param {string} source The source text to lint.
 * @param {import('eslint').Linter.Config[]} config The flat config to apply.
 * @returns {Promise<import('eslint').Linter.LintMessage[]>} The lint messages.
 */
export async function lintText(source, config) {
    const eslint = new ESLint({
        overrideConfig: config,
        overrideConfigFile: true,
    });

    const [result] = await eslint.lintText(source, {
        filePath: 'fixture.js',
    });

    return result.messages;
}
