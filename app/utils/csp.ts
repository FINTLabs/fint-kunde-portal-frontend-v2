const productionConnectSrc = "connect-src 'self'";
const developmentConnectSrc =
    "connect-src 'self' ws://localhost:* ws://127.0.0.1:* wss://localhost:* wss://127.0.0.1:*";

export function getCspReportOnly(isDev = import.meta.env.DEV): string {
    return [
        "default-src 'none'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data: https://fonts.gstatic.com https://cdn.nav.no",
        isDev ? developmentConnectSrc : productionConnectSrc,
        "base-uri 'self'",
        "form-action 'self'",
        'report-uri /api/csp-report',
    ].join('; ');
}

export const cspReportOnly = getCspReportOnly();
