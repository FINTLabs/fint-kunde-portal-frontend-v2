import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
        port: 3000,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 3000,
        },
    },
    define: {
        'process.env.PUBLIC_API_URL': JSON.stringify(process.env.API_URL),
    },
});
