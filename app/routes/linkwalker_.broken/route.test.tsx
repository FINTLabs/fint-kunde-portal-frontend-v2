import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUseLoaderData, mockUseLocation, mockUseSearchParams, mockSetSearchParams } = vi.hoisted(
    () => ({
        mockUseLoaderData: vi.fn(),
        mockUseLocation: vi.fn(),
        mockUseSearchParams: vi.fn(),
        mockSetSearchParams: vi.fn(),
    })
);

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
        useLocation: () => mockUseLocation(),
        useSearchParams: () => mockUseSearchParams(),
    };
});

vi.mock('~/components/shared/breadcrumbs', () => ({
    default: ({ breadcrumbs }: { breadcrumbs: { name: string }[] }) => (
        <div data-testid="breadcrumbs">{breadcrumbs.map((b) => b.name).join(' > ')}</div>
    ),
}));

vi.mock('~/components/shared/InternalPageHeader', () => ({
    default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('./BrokenLinksFilterForm', () => ({
    default: ({
        onSelectChange,
    }: {
        onSelectChange: (name: string, value: string) => void;
    }) => (
        <button type="button" onClick={() => onSelectChange('component', 'utdanning_elev')}>
            change-filter
        </button>
    ),
}));

vi.mock('./BrokenLinksTable', () => ({
    default: ({ pagedRows }: { pagedRows: { rows: Array<{ component: string }> } }) => (
        <div data-testid="broken-links-table">
            {pagedRows.rows.map((row) => row.component).join(',')}
        </div>
    ),
}));

import LinkWalkerErrorsRoute from './route';
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
        rows: [makeRow()],
        page: 0,
        size: 10,
        totalRows: 1,
        totalPages: 1,
        ...overrides,
    };
}

describe('linkwalker broken route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({ state: null });
        mockUseSearchParams.mockReturnValue([new URLSearchParams('page=0&size=10'), mockSetSearchParams]);
        mockUseLoaderData.mockReturnValue({
            pagedRows: makePagedRows(),
            filterRows: [makeRow()],
            orgName: 'afk_no',
        });
    });

    it('renders breadcrumbs, header and table', () => {
        render(<LinkWalkerErrorsRoute />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Link-Walker > Brutte Lenker');
        expect(
            screen.getByRole('heading', { name: 'Link-Walker - Brutte Lenker' })
        ).toBeInTheDocument();
        expect(screen.getByTestId('broken-links-table')).toHaveTextContent('utdanning_elev');
    });

    it('renders problem type summary cards from navigation state', () => {
        mockUseLocation.mockReturnValue({
            state: {
                problemTypeSummary: {
                    source: 'component',
                    component: 'utdanning_elev',
                    byProblemType: {
                        'missing-resource': 12,
                        'unknown-link': 3,
                    },
                },
            },
        });

        render(<LinkWalkerErrorsRoute />);

        expect(screen.getByText('missing-resource')).toBeInTheDocument();
        expect(screen.getByText('unknown-link')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('updates search params when filter changes', () => {
        render(<LinkWalkerErrorsRoute />);

        fireEvent.click(screen.getByRole('button', { name: 'change-filter' }));

        expect(mockSetSearchParams).toHaveBeenCalledWith(
            expect.any(URLSearchParams),
            { preventScrollReset: true }
        );
        const nextParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
        expect(nextParams.get('component')).toBe('utdanning_elev');
        expect(nextParams.get('page')).toBe('0');
    });

    it('renders pagination controls when there are rows', () => {
        mockUseLoaderData.mockReturnValue({
            pagedRows: makePagedRows({
                page: 1,
                size: 10,
                totalRows: 25,
                totalPages: 3,
            }),
            filterRows: [makeRow()],
            orgName: 'afk_no',
        });

        render(<LinkWalkerErrorsRoute />);

        expect(screen.getByLabelText('Rader per side')).toBeInTheDocument();
        expect(screen.getByText('Side 2 av 3 (25 totalt)')).toBeInTheDocument();
    });

    it('hides pagination when there are no rows', () => {
        mockUseLoaderData.mockReturnValue({
            pagedRows: makePagedRows({ rows: [], totalRows: 0, totalPages: 0 }),
            filterRows: [],
            orgName: 'afk_no',
        });

        render(<LinkWalkerErrorsRoute />);

        expect(screen.queryByLabelText('Rader per side')).not.toBeInTheDocument();
        expect(screen.queryByText(/Side \d+ av/)).not.toBeInTheDocument();
    });
});
