import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseLoaderData = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
    };
});

vi.mock('~/components/shared/breadcrumbs', () => ({
    default: ({ breadcrumbs }: { breadcrumbs: { name: string }[] }) => (
        <div data-testid="breadcrumbs">{breadcrumbs.map((b) => b.name).join(' > ')}</div>
    ),
}));

vi.mock('~/components/shared/InternalPageHeader', () => ({
    default: ({ title, children }: { title: string; children?: React.ReactNode }) => (
        <div>
            <h1>{title}</h1>
            {children}
        </div>
    ),
}));

vi.mock('./OverallSummaryCard', () => ({
    OverallSummaryCard: ({ summary }: { summary: { totalRecords: number } }) => (
        <div data-testid="overall-summary">{summary.totalRecords}</div>
    ),
}));

vi.mock('./DetailsTable', () => ({
    DetailsTable: ({
        items,
        getErrorHref,
    }: {
        items: Array<{ component: string; brokenLinkCount: number }>;
        getErrorHref?: (item: { component: string; brokenLinkCount: number }) => string;
    }) => (
        <div data-testid="details-table">
            <div data-testid="component-order">{items.map((item) => item.component).join(',')}</div>
            <div data-testid="first-error-href">
                {items[0] && getErrorHref ? getErrorHref(items[0]) : 'none'}
            </div>
        </div>
    ),
}));

import LinkWalkerRoute from './route';

const baseSummary = {
    scanCompletedAt: '2024-01-01T10:00:00Z',
    orgId: 'fint-org',
    components: ['comp-b', 'comp-a'],
    summary: {
        totalRecords: 100,
        totalRefs: 200,
        brokenLinkCount: 5,
        integrityPercent: 97.5,
        byProblemType: {},
        components: [
            {
                component: 'comp-b',
                totalRecords: 60,
                totalRefs: 120,
                brokenLinkCount: 4,
                integrityPercent: 95,
                byProblemType: {},
                resources: [],
            },
            {
                component: 'comp-a',
                totalRecords: 40,
                totalRefs: 80,
                brokenLinkCount: 1,
                integrityPercent: 99,
                byProblemType: {},
                resources: [],
            },
        ],
    },
};

describe('linkwalker route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders summary, details table and broken links report link', () => {
        mockUseLoaderData.mockReturnValue({
            summary: baseSummary,
            orgName: 'fint-org',
        });

        render(<LinkWalkerRoute />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Link-Walker');
        expect(screen.getByRole('heading', { name: 'Link-Walker' })).toBeInTheDocument();
        expect(screen.getByTestId('overall-summary')).toHaveTextContent('100');
        expect(
            screen.getByRole('button', { name: 'Vis rapport over brutte lenker' })
        ).toHaveAttribute('href', '/linkwalker/broken?page=0');
        expect(screen.getByText('Vis rapport over brutte lenker')).toBeInTheDocument();
        expect(screen.getByText('Komponentsammendrag')).toBeInTheDocument();
        expect(screen.getByTestId('component-order')).toHaveTextContent('comp-b,comp-a');
        expect(screen.getByTestId('first-error-href')).toHaveTextContent(
            '/linkwalker/broken?component=comp-b'
        );
    });

    it('passes empty component list to details table', () => {
        mockUseLoaderData.mockReturnValue({
            summary: {
                ...baseSummary,
                summary: {
                    ...baseSummary.summary,
                    components: [],
                },
            },
            orgName: 'fint-org',
        });

        render(<LinkWalkerRoute />);

        expect(screen.getByTestId('component-order')).toHaveTextContent('');
    });
});
