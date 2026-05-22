import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatDate, formatTimeOnly, parseDate } from './dateUtils';

describe('dateUtils', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-06-15T12:00:00'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('parseDate', () => {
        it('parses day/month and time using current year', () => {
            const result = parseDate('22/05 14:30');

            expect(result.getFullYear()).toBe(2024);
            expect(result.getMonth()).toBe(4);
            expect(result.getDate()).toBe(22);
            expect(result.getHours()).toBe(14);
            expect(result.getMinutes()).toBe(30);
            expect(result.getSeconds()).toBe(0);
        });
    });

    describe('formatDate', () => {
        it('formats timestamp as Norwegian date and time', () => {
            const timestamp = new Date('2024-01-15T10:30:00').getTime();

            expect(formatDate(timestamp)).toMatch(/^15\.01\.2024 /);
        });
    });

    describe('formatTimeOnly', () => {
        it('formats timestamp as Norwegian time only', () => {
            const timestamp = new Date('2024-01-15T10:30:00').getTime();

            expect(formatTimeOnly(timestamp)).toMatch(/10:30/);
        });
    });
});
