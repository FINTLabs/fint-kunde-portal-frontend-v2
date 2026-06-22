import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import EventTable from './EventTable';

vi.mock('~/utils/dateUtils', () => ({
    formatDate: (ts: number) => `formatted(${ts})`,
}));

describe('EventTable', () => {
    it('renders each event row with formatted date and fields', () => {
        render(
            <EventTable
                events={[
                    {
                        timestamp: 1000,
                        klient: 'client-a',
                        status: 'OK',
                        response: '200',
                        melding: 'hello',
                    } as any,
                ]}
            />
        );

        expect(screen.getByText('formatted(1000)')).toBeInTheDocument();
        expect(screen.getByText('client-a')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
        expect(screen.getByText('200')).toBeInTheDocument();
        expect(screen.getByText('hello')).toBeInTheDocument();
    });
});
