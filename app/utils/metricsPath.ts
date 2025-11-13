const ROUTE_PATTERNS = [
    '/',
    '/adaptere',
    '/adapter/:name',
    '/basistest',
    '/help',
    '/hendelseslogg',
    '/klienter',
    '/klienter/:id',
    '/komponenter',
    '/komponenter/:id',
    '/kontakter',
    '/logout',
    '/metrics',
    '/relasjonstest',
    '/relasjonstest/:id',
    '/ressurser',
    '/ressurser/:id',
    '/samtykke',
    '/tilgang/:id/:component/:resource',
    '/tilgang/:id/:component',
    '/user',
];

function patternToMatcher(pattern: string): RegExp {
    const esc = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = '^' + esc.replace(/:[^/]+/g, '[^/]+') + '$';
    return new RegExp(re);
}

export function normalizePathname(rawPathname: string): string {
    const pathname = rawPathname.replace(/\/+$/, '') || '/';

    for (const pattern of ROUTE_PATTERNS) {
        if (patternToMatcher(pattern).test(pathname)) {
            return pattern;
        }
    }

    return pathname;
}
