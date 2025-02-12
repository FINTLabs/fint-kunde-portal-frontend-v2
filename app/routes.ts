import { flatRoutes } from '@react-router/fs-routes';
import type { RouteConfig } from '@react-router/dev/routes';
import { route } from '@react-router/dev/routes';
// import { remixRoutesOptionAdapter } from '@remix-run/routes-option-adapter';

export default [
    ...(await flatRoutes({ rootDirectory: 'routes' })),

    // ...(await remixRoutesOptionAdapter(/* ... */)),

    route('tilgang/:id/:element', 'routes/tilgang/id/element/route.tsx'),
    route('tilgang/:id/:element/:resource', 'routes/tilgang/id/element/resource/route.tsx'),
] satisfies RouteConfig;
