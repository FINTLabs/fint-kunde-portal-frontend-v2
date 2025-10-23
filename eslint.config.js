// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default tseslint.config(
    // ---- Global ignores ----
    { ignores: ["node_modules", "dist", "build",".react-router"] },

    // Base JS + TS recommended
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // ---- JS/JSX files ----
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser, ...globals.es2021 },
            // ⬇️ Move ecmaFeatures under parserOptions (valid in flat config)
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
            import: importPlugin,
        },
        settings: {
            react: { version: "detect" },
            formComponents: ["Form"],
            linkComponents: [
                { name: "Link", linkAttribute: "to" },
                { name: "NavLink", linkAttribute: "to" },
            ],
            "import/internal-regex": "^~/",
            "import/resolver": {
                node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
                typescript: { alwaysTryTypes: true },
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs["jsx-runtime"].rules,
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,
            "no-console": "warn",
        },
    },

    // ---- TS/TSX files ----
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser, ...globals.es2021 },
            // TypeScript parser is provided by the tseslint recommended configs above.
            // If you later want type-aware rules, add:
            // parserOptions: { project: "./tsconfig.json" }
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
            import: importPlugin,
        },
        settings: {
            react: { version: "detect" },
            formComponents: ["Form"],
            linkComponents: [
                { name: "Link", linkAttribute: "to" },
                { name: "NavLink", linkAttribute: "to" },
            ],
            "import/internal-regex": "^~/",
            "import/resolver": {
                node: { extensions: [".ts", ".tsx", ".js", ".jsx"] },
                typescript: { alwaysTryTypes: true },
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs["jsx-runtime"].rules,
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,
            "no-console": "warn",
            // Place any TS-only rule tweaks here if you want
        },
    },

    // ---- Ensure .server / .client get linted (since negated ignores aren't supported) ----
    {
        files: ["**/.server/**", "**/.client/**"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.es2021 },
        },
    },

    // ---- Node env for config/scripts (replaces your .eslintrc.cjs override) ----
    {
        files: [
            "eslint.config.*",
            "**/*.config.*",
            "**/.*rc.*",
            "**/*.cjs",
            "scripts/**/*.*",
        ],
        languageOptions: {
            sourceType: "commonjs",
            globals: globals.node,
        },
    }
);
