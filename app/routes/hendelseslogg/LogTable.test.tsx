import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import LogTable from './LogTable';

vi.mock('~/routes/hendelseslogg/EventTable', () => ({
    default: ({ events }: { events: unknown[] }) => (
        <div data-testid="event-table">events:{events.length}</div>
    ),
}));

describe('LogTable', () => {
    it('renders success icon when log has no ERROR responses', () => {
        render(
            <LogTable
                logs={[
                    {
                        id: 'corr-1',
                        timestamp: 1234,
                        action: 'GET',
                        events: [{ response: '200' }],
                    } as any,
                ]}
            />
        );

        expect(screen.getByText('Helsestatus')).toBeInTheDocument();
        expect(screen.getByText('corr-1')).toBeInTheDocument();
        expect(screen.getByText('GET')).toBeInTheDocument();

        // success icon has title="CheckmarkCircleIcon"
        expect(screen.getByTitle('CheckmarkCircleIcon')).toBeInTheDocument();
    });

    it('renders error icon when any event has response ERROR', () => {
        render(
            <LogTable
                logs={[
                    {
                        id: 'corr-2',
                        timestamp: 1234,
                        action: 'GET',
                        events: [{ response: 'ERROR' }],
                    } as any,
                ]}
            />
        );

        expect(screen.queryByTitle('CheckmarkCircleIcon')).not.toBeInTheDocument();
        expect(
            screen.getAllByRole('img').some((img) => img.classList.contains('status-icon-error'))
        ).toBe(true);
    });
});
