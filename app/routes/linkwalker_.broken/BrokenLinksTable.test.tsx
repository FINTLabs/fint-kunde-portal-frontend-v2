import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BrokenLinksTable from './BrokenLinksTable';
import type { PagedRows, ReportRow } from '~/types';

function makeRow(overrides: Partial<ReportRow> = {}): ReportRow {
    return {
        orgId: 'afk_no',
        component: 'utdanning_elev',
        resource: 'elevforhold',
        problemType: 'missing-resource',
        sourceSelf: 'https://example.com/source',
        targetHref: 'https://example.com/target',
        relationName: 'elev',
        expectedInverseName: 'elevforhold',
        ...overrides,
    };
}

function makePagedRows(overrides: Partial<PagedRows> = {}): PagedRows {
    return {
        rows: [],
        page: 0,
        size: 10,
        totalRows: 0,
        totalPages: 0,
        ...overrides,
    };
}

describe('BrokenLinksTable', () => {
    it('renders empty message when there are no rows', () => {
        render(<BrokenLinksTable pagedRows={makePagedRows()} />);

        expect(screen.getByText('Ingen feil funnet.')).toBeInTheDocument();
    });

    it('renders row data with problem type tag and fallback values', () => {
        render(
            <BrokenLinksTable
                pagedRows={makePagedRows({
                    rows: [
                        makeRow(),
                        makeRow({
                            component: 'utdanning_timeplan',
                            resource: 'time',
                            problemType: 'unknown-link',
                            relationName: null,
                            expectedInverseName: null,
                        }),
                    ],
                    totalRows: 2,
                    totalPages: 1,
                })}
            />
        );

        expect(screen.getAllByText('utdanning_elev')).toHaveLength(1);
        expect(screen.getByText('utdanning_timeplan')).toBeInTheDocument();
        expect(screen.getAllByText('elevforhold')).toHaveLength(2);
        expect(screen.getByText('time')).toBeInTheDocument();
        expect(screen.getByText('missing-resource')).toBeInTheDocument();
        expect(screen.getByText('unknown-link')).toBeInTheDocument();
        expect(screen.getByText('elev')).toBeInTheDocument();
        expect(screen.getAllByText('-')).toHaveLength(2);
    });

    it('shows source and target links in expandable row content', async () => {
        render(
            <BrokenLinksTable
                pagedRows={makePagedRows({
                    rows: [makeRow({ sourceSelf: 'https://example.com/source-id' })],
                    totalRows: 1,
                    totalPages: 1,
                })}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /Vis mer/i }));

        expect(await screen.findByText('Kilde:')).toBeInTheDocument();
        expect(screen.getByText('Mål:')).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'https://example.com/source-id' })
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'https://example.com/target' })).toBeInTheDocument();
    });

    it('shows N/A when source or target href is missing', async () => {
        render(
            <BrokenLinksTable
                pagedRows={makePagedRows({
                    rows: [makeRow({ sourceSelf: '', targetHref: '' })],
                    totalRows: 1,
                    totalPages: 1,
                })}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /Vis mer/i }));

        expect(await screen.findAllByText('N/A')).toHaveLength(2);
    });
});
