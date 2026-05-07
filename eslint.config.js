// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

import cypress from 'eslint-plugin-cypress';
import vitest from '@vitest/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';

export default tseslint.config(
    // ---- Global ignores ----
    {
        ignores: ['node_modules', 'dist', 'build', 'coverage', '.react-router'],
    },

    // ---- Base JS + TS recommended ----
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // ---- JS/JSX files ----
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.es2021 },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
        },
        settings: {
            react: { version: 'detect' },
            formComponents: ['Form'],
            linkComponents: [
                { name: 'Link', linkAttribute: 'to' },
                { name: 'NavLink', linkAttribute: 'to' },
            ],
            'import/internal-regex': '^~/',
            'import/resolver': {
                node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
                typescript: { alwaysTryTypes: true },
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,
            'no-console': 'warn',
        },
    },

    // ---- TS/TSX files ----
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.es2021 },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
        },
        settings: {
            react: { version: 'detect' },
            formComponents: ['Form'],
            linkComponents: [
                { name: 'Link', linkAttribute: 'to' },
                { name: 'NavLink', linkAttribute: 'to' },
            ],
            'import/internal-regex': '^~/',
            'import/resolver': {
                node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
                typescript: { alwaysTryTypes: true },
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,
            'no-console': 'warn',
        },
    },

    // ---- Vitest + Testing Library ----
    {
        files: ['**/*.{test,spec}.{ts,tsx}', 'test/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...vitest.environments.env.globals,
            },
        },
        plugins: {
            vitest,
            'testing-library': testingLibrary,
            'jest-dom': jestDom,
        },
        rules: {
            ...vitest.configs.recommended.rules,
            ...testingLibrary.configs.react.rules,
            ...jestDom.configs.recommended.rules,

            // Relaxed rules for tests
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-console': 'off',
        },
    },

    // ---- Cypress ----
    {
        files: ['cypress/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.mocha,
                cy: 'readonly',
                Cypress: 'readonly',
                expect: 'readonly',
                assert: 'readonly',
                chai: 'readonly',
            },
        },
        plugins: {
            cypress,
        },
        rules: {
            ...cypress.configs.recommended.rules,

            // Relaxed rules for Cypress
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',

            'no-console': 'off',
        },
    },

    // ---- Ensure .server / .client get linted ----
    {
        files: ['**/.server/**', '**/.client/**'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.es2021 },
        },
    },

    // ---- Node env for config/scripts ----
    {
        files: ['eslint.config.*', '**/*.config.*', '**/.*rc.*', '**/*.cjs', 'scripts/**/*.*'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node,
        },
    }
);
