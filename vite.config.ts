import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
        'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8080'),
        'process.env.ACCESS_URL': JSON.stringify(process.env.CONSENT_API_URL || 'http://localhost:8081'),
        'process.env.LINKWALKER_API_URL': JSON.stringify(process.env.LINKWALKER_API_URL || 'http://localhost:8082'),
    },
});
