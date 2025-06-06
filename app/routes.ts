import { flatRoutes } from '@remix-run/fs-routes';
import type { RouteConfig } from '@remix-run/route-config';
import { route } from '@remix-run/route-config';
// import { remixRoutesOptionAdapter } from '@remix-run/routes-option-adapter';

export default [
    ...(await flatRoutes({ rootDirectory: 'routes' })),

    // ...(await remixRoutesOptionAdapter(/* ... */)),

    route('tilgang/:id/:component', 'routes/tilgang/id/component/route.tsx'),
    route('tilgang/:id/:component/:resource', 'routes/tilgang/id/component/resource/route.tsx'),
    route('help', 'routes/help/route.tsx'),
] satisfies RouteConfig;
