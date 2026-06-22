import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import HealthTestResultsTable from './HealthTestResultsTable';

vi.mock('~/utils/dateUtils', () => ({
    formatDate: (ts: number) => `formatted(${ts})`,
}));

describe('HealthTestResultsTable', () => {
    it('renders translated status text when mapping exists', () => {
        render(
            <HealthTestResultsTable
                logResults={[
                    {
                        component: 'adapter-1',
                        status: 'APPLICATION_HEALTHY',
                        timestamp: 123,
                    } as any,
                ]}
            />
        );

        expect(screen.getByText('adapter-1')).toBeInTheDocument();
        expect(screen.getByText('Adapter er ok')).toBeInTheDocument();
        expect(screen.getByText('formatted(123)')).toBeInTheDocument();
    });

    it('falls back to raw status when mapping does not exist', () => {
        render(
            <HealthTestResultsTable
                logResults={[
                    {
                        component: 'adapter-2',
                        status: 'SOME_NEW_STATUS',
                        timestamp: 456,
                    } as any,
                ]}
            />
        );

        expect(screen.getByText('SOME_NEW_STATUS')).toBeInTheDocument();
        expect(screen.getByText('formatted(456)')).toBeInTheDocument();
    });
});
