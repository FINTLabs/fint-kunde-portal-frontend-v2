import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
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
            //         route('tilgang/:id/:element', 'routes/tilgang/id/element/route.tsx');
            //         route(
            //             'tilgang/:id/:element/:resource',
            //             'routes/tilgang/id/element/resource/route.tsx'
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
