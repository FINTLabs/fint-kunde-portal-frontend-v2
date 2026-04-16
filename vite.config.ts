/// <reference types="vitest/config" />
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tailwindcss(), !process.env.VITEST && reactRouter(), tsconfigPaths()].filter(Boolean),
    server: {
        port: 3000,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 3000,
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: './app/test/setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['app/**/*.{ts,tsx}'],
            exclude: [
                'app/**/*.test.{ts,tsx}',
                'app/test/**',
                'cypress/**',
                'build/**',
                'coverage/**',
            ],
            excludeAfterRemap: true,
            thresholds: {
                lines: 70,
                statements: 70,
                functions: 70,
                branches: 60,
            },
        },
    },
});
