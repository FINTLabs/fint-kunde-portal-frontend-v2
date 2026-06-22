import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUseLoaderData, mockUseFetcher, mockHandleBasicTestAction, mockBasicTestAddFormProps } =
    vi.hoisted(() => ({
        mockUseLoaderData: vi.fn(),
        mockUseFetcher: vi.fn(),
        mockHandleBasicTestAction: vi.fn(),
        mockBasicTestAddFormProps: vi.fn(),
    }));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
        useFetcher: () => mockUseFetcher(),
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('~/routes/basistest/actions', () => ({
    handleBasicTestAction: (args: any) => mockHandleBasicTestAction(args),
}));

vi.mock('./loaders', () => ({
    loader: vi.fn(),
}));

vi.mock('~/components/shared/breadcrumbs', () => ({
    default: ({ breadcrumbs }: { breadcrumbs: { name: string }[] }) => (
        <div data-testid="breadcrumbs">{breadcrumbs.map((b) => b.name).join(' > ')}</div>
    ),
}));

vi.mock('~/components/shared/InternalPageHeader', () => ({
    InternalPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('~/routes/basistest/BasicTestAddForm', () => ({
    default: (props: {
        onSearchSubmit: (baseUrl: string, endpoint: string, clientName: string) => void;
    }) => {
        mockBasicTestAddFormProps(props);
        return (
            <div data-testid="basic-test-add-form">
                <button
                    type="button"
                    onClick={() =>
                        props.onSearchSubmit('https://api.example.com', '/endpoint', 'client-x')
                    }>
                    submit-search
                </button>
            </div>
        );
    },
}));

vi.mock('~/routes/basistest/HealthTestResultsTable', () => ({
    default: ({ logResults }: { logResults: unknown[] }) => (
        <div data-testid="health-table">health:{logResults.length}</div>
    ),
}));

vi.mock('~/routes/basistest/CacheStatusTable', () => ({
    default: ({ logResults }: { logResults: unknown[] }) => (
        <div data-testid="cache-table">cache:{logResults.length}</div>
    ),
}));

import Index, { action, meta } from './route';

describe('basistest route', () => {
    const mockSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseLoaderData.mockReturnValue({
            components: [
                {
                    dn: 'dn-comp',
                    name: 'comp',
                    description: 'Comp',
                    organisations: [],
                    clients: [],
                    adapters: [],
                    basePath: '/comp',
                    port: null,
                    core: false,
                    openData: false,
                    common: false,
                    cacheDisabledFor: [],
                    inProduction: false,
                    inBeta: false,
                    inPlayWithFint: true,
                },
            ],
            clients: [
                {
                    dn: 'dn-client',
                    name: 'client-x',
                    shortDescription: 'Client X',
                    note: '',
                    assetId: [],
                    asset: '',
                    clientId: 'id',
                    components: [],
                    accessPackages: [],
                    managed: false,
                },
            ],
        });

        mockUseFetcher.mockReturnValue({
            state: 'idle',
            data: undefined,
            submit: mockSubmit,
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Basis Test' },
            { name: 'description', content: 'Run Basis Test' },
        ]);
    });

    it('renders breadcrumbs, header and warning when no actionData and not submitting', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.basicTest');
        expect(screen.getByRole('heading', { name: 'menu.basicTest' })).toBeInTheDocument();

        // warning block should show when idle + no actionData
        expect(screen.getByText('mainRoutes.basicTest.warningTitle')).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.basicTest.warningDescription')).toBeInTheDocument();

        // form always shown
        expect(screen.getByTestId('basic-test-add-form')).toBeInTheDocument();
    });

    it('submits FormData through fetcher.submit when BasicTestAddForm calls onSearchSubmit', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'submit-search' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('baseUrl')).toBe('https://api.example.com');
        expect(formData.get('endpoint')).toBe('/endpoint');
        expect(formData.get('clientName')).toBe('client-x');
        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post' });
    });

    it('shows loader when fetcher is submitting and has actionData', () => {
        mockUseFetcher.mockReturnValue({
            state: 'submitting',
            data: {
                variant: 'info',
                message: 'ok',
                clientName: 'client-x',
                testUrl: 'https://api.example.com/endpoint',
                data: {
                    healthData: { healthData: [{}, {}] },
                    cacheData: { resourceResults: [{}] },
                },
            },
            submit: mockSubmit,
        });

        render(<Index />);

        // In submitting state with actionData, the route should show a Loader
        // The loader has title= t('mainRoutes.basicTest.loadingTitle')
        expect(screen.getByTitle('mainRoutes.basicTest.loadingTitle')).toBeInTheDocument();
    });

    it('renders error title when variant is error', () => {
        mockUseFetcher.mockReturnValue({
            state: 'idle',
            data: {
                variant: 'error',
                message: 'boom',
                clientName: '',
                testUrl: 'https://api.example.com/endpoint',
                data: {
                    healthData: { healthData: [] },
                    cacheData: { resourceResults: [] },
                },
            },
            submit: mockSubmit,
        });

        render(<Index />);

        expect(screen.getByText('mainRoutes.basicTest.errorRunningTest')).toBeInTheDocument();

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('mainRoutes.basicTest.clientLabel');
        expect(alert).toHaveTextContent('mainRoutes.basicTest.noClient');
    });

    it('action delegates to handleBasicTestAction', async () => {
        const args = {
            request: new Request('http://localhost/basistest', { method: 'POST' }),
        } as any;
        const expected = { ok: true };
        mockHandleBasicTestAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleBasicTestAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
