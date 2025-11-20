import { route, type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';
// import { remixRoutesOptionAdapter } from '@remix-run/routes-option-adapter';
// **** REMEMBER: if you add a new route, add this to metricsPaths.ts also :)

export default [
    ...(await flatRoutes({ rootDirectory: 'routes' })),

    // ...(await remixRoutesOptionAdapter(/* ... */)),

    route('tilgang/:id/:component', 'routes/tilgang/id/component/route.tsx'),
    route('tilgang/:id/:component/:resource', 'routes/tilgang/id/component/resource/route.tsx'),
    route('help', 'routes/help/route.tsx'),
] satisfies RouteConfig;
