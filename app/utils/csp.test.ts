import { describe, expect, it } from 'vitest';

import { cspReportOnly, getCspReportOnly } from './csp';

describe('cspReportOnly', () => {
    it('includes expected CSP directives', () => {
        expect(cspReportOnly).toContain("default-src 'none'");
        expect(cspReportOnly).toContain("script-src 'self'");
        expect(cspReportOnly).toContain("style-src 'self'");
        expect(cspReportOnly).toContain("connect-src 'self'");
        expect(cspReportOnly).toContain('report-uri /api/csp-report');
    });

    it('allows local Vite HMR websockets in development', () => {
        const csp = getCspReportOnly(true);
        expect(csp).toContain('ws://localhost:*');
        expect(csp).toContain('ws://127.0.0.1:*');
    });

    it('does not allow websocket schemes in production', () => {
        const csp = getCspReportOnly(false);
        expect(csp).toContain("connect-src 'self'");
        expect(csp).not.toContain('ws://');
        expect(csp).not.toContain('wss://');
    });
});
