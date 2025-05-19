import { defineConfig } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { includeIgnoreFile } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default defineConfig([
    includeIgnoreFile(gitignorePath),
    {
        extends: compat.extends('plugin:@typescript-eslint/recommended'),
        plugins: {
            '@typescript-eslint': typescriptEslint,
            'unused-imports': unusedImports
        },
        languageOptions: {
            globals: {},
            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: 'script'
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.ts']
                }
            }
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
            'max-len': [
                'warn',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true
                }
            ],
            'linebreak-style': 0,
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ],
            quotes: [
                'error',
                'single',
                {
                    allowTemplateLiterals: true
                }
            ],
            semi: ['error', 'always'],
            'keyword-spacing': [
                'error',
                {
                    before: true,
                    after: true
                }
            ],
            'object-curly-spacing': ['error', 'always'],
            'space-before-blocks': [
                'error',
                {
                    functions: 'always',
                    keywords: 'always',
                    classes: 'always'
                }
            ],
            'comma-dangle': ['error', 'never'],
            'no-console': 'off',
            'no-unused-vars': 'off',
            'no-multiple-empty-lines': 'error',
            'prefer-const': 'off'
        }
    }
]);
