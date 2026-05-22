import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseAlerts,
    mockHandleLogAction,
    mockLogSearchFormProps,
    mockLogTableProps,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleLogAction: vi.fn(),
    mockLogSearchFormProps: vi.fn(),
    mockLogTableProps: vi.fn(),
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
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('novari-frontend-components', () => ({
    NovariToaster: ({ items }: { items: unknown[] }) => (
        <div data-testid="toaster">alerts:{items.length}</div>
    ),
    useAlerts: (...args: any[]) => mockUseAlerts(...args),
}));

vi.mock('~/routes/hendelseslogg/actions', () => ({
    handleLogAction: (args: any) => mockHandleLogAction(args),
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

vi.mock('~/routes/hendelseslogg/LogSearchForm', () => ({
    default: (props: {
        onSearchSubmit: (formData: FormData) => void;
        onFilter: (value: string) => void;
    }) => {
        mockLogSearchFormProps(props);
        return (
            <div data-testid="search-form">
                <button
                    type="button"
                    onClick={() => {
                        const fd = new FormData();
                        fd.append('environment', 'api');
                        fd.append('component', 'comp-1');
                        fd.append('resource', 'Student');
                        fd.append('action', 'GET');
                        props.onSearchSubmit(fd);
                    }}>
                    do-search
                </button>
                <button type="button" onClick={() => props.onFilter('corr-1')}>
                    filter-corr-1
                </button>
                <button type="button" onClick={() => props.onFilter('')}>
                    clear-filter
                </button>
            </div>
        );
    },
}));

vi.mock('./LogTable', () => ({
    default: (props: { logs: unknown[] }) => {
        mockLogTableProps(props);
        return <div data-testid="log-table">rows:{props.logs.length}</div>;
    },
}));

import Index, { action, meta } from './route';

describe('hendelseslogg route', () => {
    const mockSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseLoaderData.mockReturnValue({
            components: [],
            configs: [],
        });

        mockUseFetcher.mockReturnValue({
            state: 'idle',
            data: undefined,
            submit: mockSubmit,
        });

        mockUseAlerts.mockReturnValue({
            alertState: [{ message: 'ok' }],
            setAlertState: vi.fn(),
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Hendelseslogg' },
            { name: 'description', content: 'Hendelseslogg' },
        ]);
    });

    it('renders breadcrumbs, header and toaster', () => {
        render(<Index />);
        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.eventLog');
        expect(screen.getByRole('heading', { name: 'menu.eventLog' })).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.getByTestId('search-form')).toBeInTheDocument();
    });

    it('submits search FormData through fetcher.submit with correct action', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'do-search' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('environment')).toBe('api');
        expect(formData.get('component')).toBe('comp-1');
        expect(formData.get('resource')).toBe('Student');
        expect(formData.get('action')).toBe('GET');

        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post', action: '/hendelseslogg' });
    });

    it('maps redundant logs into grouped logs and passes them to LogTable', () => {
        mockUseFetcher.mockReturnValue({
            state: 'idle',
            submit: mockSubmit,
            data: {
                success: true,
                data: [
                    {
                        corrId: 'corr-1',
                        timestamp: 111,
                        event: {
                            action: 'GET',
                            time: 100,
                            client: 'c1',
                            status: 'SENT',
                            responseStatus: '200',
                            message: 'm1',
                        },
                    },
                    {
                        corrId: 'corr-1',
                        timestamp: 111,
                        event: {
                            action: 'GET',
                            time: 101,
                            client: 'c1',
                            status: 'RECEIVED',
                            responseStatus: '200',
                            message: 'm2',
                        },
                    },
                ],
            },
        });

        render(<Index />);

        expect(screen.getByTestId('log-table')).toHaveTextContent('rows:1');
        expect(mockLogTableProps).toHaveBeenCalledTimes(1);

        const passed = mockLogTableProps.mock.calls[0][0].logs as any[];
        expect(passed[0].id).toBe('corr-1');
        expect(passed[0].events).toHaveLength(2);
        expect(passed[0].action).toBe('GET');
    });

    it('filters logs by correlation id when onFilter is called', () => {
        mockUseFetcher.mockReturnValue({
            state: 'idle',
            submit: mockSubmit,
            data: {
                success: true,
                data: [
                    {
                        corrId: 'corr-1',
                        timestamp: 111,
                        event: {
                            action: 'GET',
                            time: 100,
                            client: 'c1',
                            status: 'SENT',
                            responseStatus: '200',
                            message: 'm1',
                        },
                    },
                    {
                        corrId: 'corr-2',
                        timestamp: 222,
                        event: {
                            action: 'GET',
                            time: 200,
                            client: 'c2',
                            status: 'SENT',
                            responseStatus: '200',
                            message: 'm1',
                        },
                    },
                ],
            },
        });

        render(<Index />);

        // initially 2 corrIds -> mapped to 2 logs
        expect(screen.getByTestId('log-table')).toHaveTextContent('rows:2');

        fireEvent.click(screen.getByRole('button', { name: 'filter-corr-1' }));
        expect(screen.getByTestId('log-table')).toHaveTextContent('rows:1');

        fireEvent.click(screen.getByRole('button', { name: 'clear-filter' }));
        expect(screen.getByTestId('log-table')).toHaveTextContent('rows:2');
    });

    it('action delegates to handleLogAction', async () => {
        const args = {
            request: new Request('http://localhost/hendelseslogg', { method: 'POST' }),
        } as any;
        const expected = { success: true };
        mockHandleLogAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleLogAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
