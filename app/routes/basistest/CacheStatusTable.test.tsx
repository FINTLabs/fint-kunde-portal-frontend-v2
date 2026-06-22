import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import CacheStatusTable from './CacheStatusTable';

vi.mock('~/utils/dateUtils', () => ({
    formatDate: (ts: number) => `formatted(${ts})`,
}));

describe('CacheStatusTable', () => {
    it('renders NO RESOURCES FOUND when logResults is null', () => {
        render(<CacheStatusTable logResults={null} />);
        expect(screen.getByText('NO RESOURCES FOUND')).toBeInTheDocument();
    });

    it('renders OK icon and formats date when status is OK and lastUpdated > 0', () => {
        render(
            <CacheStatusTable
                logResults={[
                    {
                        status: 'OK',
                        resource: 'res-1',
                        message: 'hello',
                        size: 10,
                        lastUpdated: 1000,
                    } as any,
                ]}
            />
        );

        expect(screen.getByText('res-1')).toBeInTheDocument();
        expect(screen.getByText('hello')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('formatted(1000)')).toBeInTheDocument();

        expect(screen.getByTitle('OK')).toBeInTheDocument();
    });

    it('renders Error icon and default message when message is empty', () => {
        render(
            <CacheStatusTable
                logResults={[
                    {
                        status: 'ERROR',
                        resource: 'res-2',
                        message: '',
                        size: 0,
                        lastUpdated: 0,
                    } as any,
                ]}
            />
        );

        expect(screen.getByText('res-2')).toBeInTheDocument();
        expect(screen.getByText('Ingen melding')).toBeInTheDocument();
        expect(screen.queryByText('formatted(0)')).not.toBeInTheDocument();

        expect(screen.getByTitle('Error')).toBeInTheDocument();
    });
});
