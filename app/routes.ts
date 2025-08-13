import { flatRoutes } from '@react-router/fs-routes';
import type { RouteConfig } from '@react-router/dev/routes';
import { route } from '@react-router/dev/routes';
// import { remixRoutesOptionAdapter } from '@remix-run/routes-option-adapter';

export default [
    ...(await flatRoutes({ rootDirectory: 'routes' })),

    // ...(await remixRoutesOptionAdapter(/* ... */)),

    route('tilgang/:id/:component', 'routes/tilgang/id/component/route.tsx'),
    route('tilgang/:id/:component/:resource', 'routes/tilgang/id/component/resource/route.tsx'),
    route('help', 'routes/help/route.tsx'),
] satisfies RouteConfig;
