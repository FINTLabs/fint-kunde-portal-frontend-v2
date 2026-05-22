import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseNavigate,
    mockUseAlerts,
    mockHandleClientIndexAction,
    mockUseDeletedSearchParamAlert,
    mockCustomTabsProps,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseNavigate: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleClientIndexAction: vi.fn(),
    mockUseDeletedSearchParamAlert: vi.fn(),
    mockCustomTabsProps: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
        useFetcher: () => mockUseFetcher(),
        useNavigate: () => mockUseNavigate(),
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('novari-frontend-components', () => ({
    NovariToaster: ({ items }: { items: unknown[] }) => (
        <div data-testid="toaster">alerts:{items.length}</div>
    ),
    useAlerts: () => mockUseAlerts(),
}));

vi.mock('~/hooks/useDeletedSearchParamAlert', () => ({
    useDeletedSearchParamAlert: (args: unknown) => mockUseDeletedSearchParamAlert(args),
}));

vi.mock('~/routes/klienter._index/actions', () => ({
    handleClientIndexAction: mockHandleClientIndexAction,
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
    InternalPageHeader: ({ title, children }: { title: string; children?: React.ReactNode }) => (
        <div>
            <h1>{title}</h1>
            {children}
        </div>
    ),
}));

vi.mock('~/components/shared/CustomTabs', () => ({
    CustomTabs: (props: {
        items: Array<{ name: string; shortDescription: string }>;
        showDetails: (id: string) => void;
    }) => {
        mockCustomTabsProps(props);
        return (
            <div>
                <div data-testid="tabs-items">{props.items.map((i) => i.shortDescription).join(',')}</div>
                <button type="button" onClick={() => props.showDetails(props.items[0]?.name ?? '')}>
                    show-first-details
                </button>
            </div>
        );
    },
}));

vi.mock('~/routes/klienter._index/CreateForm', () => ({
    default: ({
        onCancel,
        onSave,
        orgName,
    }: {
        onCancel: () => void;
        onSave: (formData: FormData) => void;
        orgName: string;
    }) => (
        <div data-testid="create-form">
            <div>{orgName}</div>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('name', 'new-client');
                    formData.append('description', 'Ny klient');
                    formData.append('note', 'Notat');
                    formData.append('modelVersion', 'V3');
                    onSave(formData);
                }}>
                save-create
            </button>
            <button type="button" onClick={onCancel}>
                cancel-create
            </button>
        </div>
    ),
}));

import Index, { action, meta } from './route';

const staleLoginTime = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
const activeLoginTime = new Date().toISOString();

const baseClients = [
    {
        name: 'active-client',
        shortDescription: 'Active Client',
        managed: false,
        lastLoginTime: activeLoginTime,
    },
    {
        name: 'stale-client',
        shortDescription: 'Stale Client',
        managed: false,
        lastLoginTime: staleLoginTime,
    },
    {
        name: 'missing-client',
        shortDescription: 'Missing Client',
        managed: false,
        lastLoginTime: null,
    },
];

describe('klienter index route', () => {
    const mockSubmit = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
        mockUseFetcher.mockReturnValue({
            data: {},
            state: 'idle',
            submit: mockSubmit,
        });
        mockUseAlerts.mockReturnValue({
            alertState: [{ message: 'ok' }],
            setAlertState: vi.fn(),
        });
        mockUseLoaderData.mockReturnValue({
            clientData: baseClients,
            modelVersion: { V3: 2, V4: 1 },
            orgName: 'fint_org',
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Klienter' },
            { name: 'description', content: 'klienter' },
        ]);
    });

    it('renders breadcrumbs, header and client tabs', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.clients');
        expect(screen.getByRole('heading', { name: 'menu.clients' })).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.getByTestId('tabs-items')).toHaveTextContent('Active Client');
        expect(screen.getByTestId('tabs-items')).toHaveTextContent('Stale Client');
        expect(screen.getByTestId('tabs-items')).toHaveTextContent('Missing Client');
        expect(mockUseDeletedSearchParamAlert).toHaveBeenCalledTimes(1);
    });

    it('shows model version progress when conversion is incomplete', () => {
        render(<Index />);

        expect(screen.getByText(/1 av 3 klienter/)).toBeInTheDocument();
        expect(screen.queryByText('Konvertering til V4 fullført')).not.toBeInTheDocument();
    });

    it('shows completed conversion message when all clients are on V4', () => {
        mockUseLoaderData.mockReturnValue({
            clientData: baseClients,
            modelVersion: { V3: 0, V4: 3 },
            orgName: 'fint_org',
        });

        render(<Index />);

        expect(screen.getByText('Konvertering til V4 fullført')).toBeInTheDocument();
    });

    it('filters clients based on search value', () => {
        render(<Index />);

        fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'stale' } });

        expect(screen.getByTestId('tabs-items')).toHaveTextContent('Stale Client');
        expect(screen.getByTestId('tabs-items')).not.toHaveTextContent('Active Client');
    });

    it('filters clients based on login status chips', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'Ingen pålogging' }));
        fireEvent.click(screen.getByRole('button', { name: 'Over 30 dager' }));

        expect(screen.getByTestId('tabs-items')).toHaveTextContent('Active Client');
        expect(screen.getByTestId('tabs-items')).not.toHaveTextContent('Missing Client');
        expect(screen.getByTestId('tabs-items')).not.toHaveTextContent('Stale Client');
    });

    it('navigates to encoded client details path from tabs', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'show-first-details' }));

        expect(mockNavigate).toHaveBeenCalledWith('/klienter/active-client');
    });

    it('shows create form and submits create payload through fetcher', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'mainRoutes.clientsIndex.createButton' }));
        expect(screen.getByTestId('create-form')).toBeInTheDocument();
        expect(screen.getByText('fint_org')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'save-create' }));
        expect(mockSubmit).toHaveBeenCalledTimes(1);

        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('name')).toBe('new-client');
        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post', action: '/klienter' });
    });

    it('returns to list when create form is cancelled', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'mainRoutes.clientsIndex.createButton' }));
        fireEvent.click(screen.getByRole('button', { name: 'cancel-create' }));

        expect(screen.queryByTestId('create-form')).not.toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'mainRoutes.clientsIndex.createButton' })
        ).toBeInTheDocument();
    });

    it('action delegates to handleClientIndexAction', async () => {
        const args = { request: new Request('http://localhost/klienter', { method: 'POST' }) } as any;
        const expected = { success: true };
        mockHandleClientIndexAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleClientIndexAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
