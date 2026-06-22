import { describe, expect, it } from 'vitest';

import { cspReportOnly } from './csp';

describe('cspReportOnly', () => {
    it('includes expected CSP directives', () => {
        expect(cspReportOnly).toContain("default-src 'none'");
        expect(cspReportOnly).toContain("script-src 'self'");
        expect(cspReportOnly).toContain("style-src 'self'");
        expect(cspReportOnly).toContain("connect-src 'self'");
        expect(cspReportOnly).toContain("frame-ancestors 'none'");
        expect(cspReportOnly).toContain('report-uri /api/csp-report');
    });
});
