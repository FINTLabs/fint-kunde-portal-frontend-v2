import { describe, expect, it } from 'vitest';

import {
    convertTimeStamp,
    formatComponents,
    formatDate,
    timeSince,
} from './statusUtils';

describe('statusUtils', () => {
    describe('formatDate', () => {
        it('returns Never for non-positive timestamps', () => {
            expect(formatDate(0)).toBe('Never');
            expect(formatDate(-1)).toBe('Never');
        });

        it('formats positive timestamps in Norwegian locale', () => {
            const timestamp = new Date('2024-01-15T10:30:00').getTime();

            expect(formatDate(timestamp)).toMatch(/2024/);
            expect(formatDate(timestamp)).toMatch(/15/);
        });
    });

    describe('formatComponents', () => {
        it('returns unique top-level resource names from dotted components', () => {
            expect(
                formatComponents(['utdanning.elev', 'utdanning.person', 'okonomi.faktura'])
            ).toEqual(['utdanning', 'okonomi']);
        });

        it('ignores components without a dot separator', () => {
            expect(formatComponents(['utdanning', 'okonomi.faktura'])).toEqual(['okonomi']);
        });
    });

    describe('timeSince', () => {
        const compareTo = new Date('2024-06-15T12:00:00').getTime();

        it('returns unknown label for undefined timestamp', () => {
            expect(timeSince(undefined, compareTo)).toBe('Ukjent tidspunkt');
        });

        it('returns detailed duration when compareTo is provided', () => {
            const oneHourAgo = new Date('2024-06-15T11:00:00').getTime();

            expect(timeSince(oneHourAgo, compareTo)).toBe('1 t, 0 m og 0 s');
        });

        it('returns greater than one year for long durations', () => {
            const twoYearsAgo = new Date('2022-06-15T12:00:00').getTime();

            expect(timeSince(twoYearsAgo, compareTo)).toBe('> 1 år');
        });
    });

    describe('convertTimeStamp', () => {
        it('returns unknown label for undefined timestamp', () => {
            expect(convertTimeStamp(undefined)).toBe('Ukjent tidspunkt');
        });

        it('formats timestamp as dd.mm.yyyy hh:mm', () => {
            const timestamp = new Date('2024-01-15T10:30:00').getTime();

            expect(convertTimeStamp(timestamp)).toBe('15.01.2024 10:30');
        });
    });
});
