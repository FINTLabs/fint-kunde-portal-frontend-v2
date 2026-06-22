import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ComponentAccessLog from './ComponentAccessLog';

vi.mock('~/utils/dateUtils', () => ({
    formatDate: (ts: number) => `formatted(${ts})`,
}));

describe('ComponentAccessLog', () => {
    it('renders empty state when access log is missing', () => {
        render(<ComponentAccessLog accessLog={null} />);

        expect(screen.getByText('Ingen tilgangslogger registrert')).toBeInTheDocument();
    });

    it('renders access log entries with formatted values', () => {
        render(
            <ComponentAccessLog
                accessLog={{
                    username: 'client-a',
                    accessLogs: [
                        {
                            timestamp: 1000,
                            domain: 'utdanning',
                            pkg: 'larling',
                            resource: 'Elev',
                            hadAccess: true,
                        },
                        {
                            timestamp: 2000,
                            domain: 'utdanning',
                            pkg: 'elev',
                            resource: 'Skole',
                            hadAccess: false,
                        },
                    ],
                }}
            />
        );

        expect(screen.getByText('Tilgangslogg for client-a (2 logger)')).toBeInTheDocument();
        expect(screen.getByText('formatted(1000)')).toBeInTheDocument();
        expect(screen.getByText('larling')).toBeInTheDocument();
        expect(screen.getAllByText('Tilgang').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Ingen tilgang')).toBeInTheDocument();
    });

    it('shows only first 10 logs until full log is requested', () => {
        const accessLogs = Array.from({ length: 12 }, (_, index) => ({
            timestamp: index + 1,
            domain: 'utdanning',
            pkg: `pkg-${index}`,
            resource: `resource-${index}`,
            hadAccess: index % 2 === 0,
        }));

        render(
            <ComponentAccessLog
                accessLog={{
                    username: 'client-a',
                    accessLogs,
                }}
            />
        );

        expect(screen.getByText('Viser de siste 10 loggene')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(11);

        fireEvent.click(screen.getByRole('button', { name: 'Vis full logg' }));

        expect(screen.getByText('Tilgangslogg for client-a (12 logger)')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(13);
    });
});
