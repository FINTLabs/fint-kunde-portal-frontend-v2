// export const cspReportOnly = [
//     "default-src 'none'",
//     "script-src 'self' 'unsafe-inline'",
//     "style-src 'self' 'unsafe-inline'",
//     "img-src 'self' data: blob:",
//     // "font-src 'self' 'https://fonts.gstatic.com' 'data: ' 'https://cdn.nav.no'",
//     "font-src 'self' 'https://fonts.gstatic.com' 'data:' 'https://cdn.nav.no' ",
//     // ["'self'", 'data:', 'https://fonts.gstatic.com', 'https://cdn.nav.no'],
//     "connect-src 'self'",
//     "base-uri 'self'",
//     "form-action 'self'",
//     'report-uri /api/csp-report',
// ].join('; ');

export const cspReportOnly = [
    "default-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data: https://fonts.gstatic.com https://cdn.nav.no",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
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
