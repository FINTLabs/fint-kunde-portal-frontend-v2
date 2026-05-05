export const cspReportOnly = [
    "default-src 'none'",
    "script-src 'self' 'sha256-dNy0y48tFd3Ueh+izbVssQPVSHSkZce1VpirT2wc1j4='",
    "style-src 'self' 'sha256-GpfW+bAfgFdUnWgH132TmXe74zxmBoQ23bG1FpTFo/Q='",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' https://cdn.nav.no",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    'upgrade-insecure-requests',
    'report-uri /api/csp-report',
].join('; ');

// very strict
// Content-Security-Policy:
// default-src 'none';
// script-src 'self';
// style-src 'self';
// img-src 'self';
// font-src 'self';
// connect-src 'self';
// base-uri 'self';
// form-action 'self';
// frame-ancestors 'none';
// object-src 'none';
// upgrade-insecure-requests;

// "default-src 'self'",
//     "base-uri 'self'",
//     "object-src 'none'",
//     "frame-ancestors 'self'",
//     "img-src 'self' data: blob:",
//     "font-src 'self' data:",
//     "style-src 'self' 'unsafe-inline'",
//     "script-src 'self' 'unsafe-inline'",
//     "connect-src 'self' ws: wss: https:",
