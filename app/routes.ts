import { flatRoutes } from '@remix-run/fs-routes';
import type { RouteConfig } from '@remix-run/route-config';
import { route } from '@remix-run/route-config';
// import { remixRoutesOptionAdapter } from '@remix-run/routes-option-adapter';

export default [
    ...(await flatRoutes({ rootDirectory: 'routes' })),

    // ...(await remixRoutesOptionAdapter(/* ... */)),

    route('tilgang/:id/:element', 'routes/tilgang/id/element/route.tsx'),
    route('tilgang/:id/:element/:resource', 'routes/tilgang/id/element/resource/route.tsx'),
] satisfies RouteConfig;
