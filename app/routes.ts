import { route, type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';
// import { remixRoutesOptionAdapter } from '@remix-run/routes-option-adapter';

export default [
    ...(await flatRoutes({ rootDirectory: 'routes' })),

    // ...(await remixRoutesOptionAdapter(/* ... */)),

    route('tilgang/:id/:component', 'routes/tilgang/id/component/route.tsx'),
    route('tilgang/:id/:component/:resource', 'routes/tilgang/id/component/resource/route.tsx'),
    // route('tilgang/:id/:component/:resource/:field', 'routes/tilgang/id/component/resource/field/route.tsx'),
    // route('/status', 'routes/status/route.tsx'),
    // route('/status/adaptere', 'routes/status/adaptere/route.tsx'),
    // route('/status/hendelser', 'routes/status/hendelser/route.tsx'),
    // route('/status/test', 'routes/status/test/route.tsx'),
    // route('/status/test2', 'routes/status/test2/route.tsx'),
    // route('/setEnv', 'routes/status/setEnv.tsx'),
    route('help', 'routes/help/route.tsx'),
] satisfies RouteConfig;
