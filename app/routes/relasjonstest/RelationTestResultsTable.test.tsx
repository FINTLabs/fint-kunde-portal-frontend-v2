import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RelationTestResultsTable from './RelationTestResultsTable';
import type { ILogResults } from '~/types/RelationTest';

vi.mock('~/utils/dateUtils', () => ({
    parseDate: (time: string) => new Date(time),
}));

function makeResult(overrides: Partial<ILogResults> = {}): ILogResults {
    return {
        id: 'test-1',
        url: 'https://example.com',
        env: 'pwf',
        uri: '/utdanning',
        client: 'client-a',
        requests: 10,
        time: '2024-01-01T10:00:00',
        relationErrors: 1,
        healthyRelations: 8,
        totalRequests: 10,
        status: 'COMPLETED',
        org: 'fint-org',
        errorMessage: '',
        ...overrides,
    };
}

describe('RelationTestResultsTable', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('renders completed and failed test rows with calculated remaining count', () => {
        render(
            <RelationTestResultsTable
                logResults={[
                    makeResult({
                        id: 'completed-1',
                        status: 'COMPLETED',
                        time: '2024-01-02T10:00:00',
                        totalRequests: 10,
                        healthyRelations: 8,
                        relationErrors: 1,
                    }),
                    makeResult({
                        id: 'failed-1',
                        status: 'FAILED',
                        time: '2024-01-01T10:00:00',
                        errorMessage: 'Something went wrong',
                        env: 'beta',
                        uri: '/okonomi',
                    }),
                ]}
            />
        );

        expect(screen.getByText('2024-01-02T10:00:00')).toBeInTheDocument();
        expect(screen.getByText('2024-01-01T10:00:00')).toBeInTheDocument();
        expect(screen.getByText('beta')).toBeInTheDocument();
        expect(screen.getByText('/okonomi')).toBeInTheDocument();
        expect(screen.getAllByText('8').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByTitle('COMPLETED')).toBeInTheDocument();
        expect(screen.getByTitle('FAILED')).toBeInTheDocument();
    });

    it('shows loader for in-progress tests', () => {
        render(
            <RelationTestResultsTable
                logResults={[makeResult({ status: 'STARTED', errorMessage: '' })]}
            />
        );

        expect(screen.getByText('Venter...')).toBeInTheDocument();
    });

    it('downloads result file when download button is clicked', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(new Blob(['excel'])),
        });
        vi.stubGlobal('fetch', fetchMock);

        const createObjectURL = vi
            .spyOn(window.URL, 'createObjectURL')
            .mockReturnValue('blob:url');
        const revokeObjectURL = vi
            .spyOn(window.URL, 'revokeObjectURL')
            .mockImplementation(() => {});
        const clickSpy = vi
            .spyOn(HTMLAnchorElement.prototype, 'click')
            .mockImplementation(() => {});

        render(<RelationTestResultsTable logResults={[makeResult({ id: 'download-1' })]} />);

        fireEvent.click(screen.getByTitle('Download Excel'));

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith('/relasjonstest/download-1', { method: 'GET' });
        });
        expect(createObjectURL).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:url');
    });
});
