import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        remix({
            future: {
                v3_fetcherPersist: true,
                v3_relativeSplatPath: true,
                v3_throwAbortReason: true,
                v3_lazyRouteDiscovery: true,
                v3_singleFetch: true,
                v3_routeConfig: true,
            },
            // routes(defineRoutes) {
            //     return defineRoutes((route) => {
            //         route('tilgang/:id/:resource', 'routes/tilgang/id/resource/route.tsx');
            //         route(
            //             'tilgang/:id/:resource/:resource',
            //             'routes/tilgang/id/resource/resource/route.tsx'
            //         );
            //     });
            // },
        }),
        tsconfigPaths(),
    ],
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
