import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseNavigate,
    mockUseAlerts,
    mockHandleAdapterIndexAction,
    mockUseDeletedSearchParamAlert,
    mockCustomTabsProps,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseNavigate: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleAdapterIndexAction: vi.fn(),
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

vi.mock('~/routes/adaptere._index/actions', () => ({
    handleAdapterIndexAction: mockHandleAdapterIndexAction,
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
                <button type="button" onClick={() => props.showDetails(props.items[0].name)}>
                    show-first-details
                </button>
            </div>
        );
    },
}));

vi.mock('~/routes/adaptere._index/CreateForm', () => ({
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
                    formData.append('name', 'new-adapter');
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

describe('adapter index route', () => {
    const mockSubmit = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
        mockUseFetcher.mockReturnValue({
            data: {},
            submit: mockSubmit,
        });
        mockUseAlerts.mockReturnValue({
            alertState: [{ message: 'ok' }],
            setAlertState: vi.fn(),
        });
        mockUseLoaderData.mockReturnValue({
            adapters: [
                { name: 'z@adapter.fint.no', shortDescription: 'Zulu', managed: false },
                { name: 'a@adapter.fint.no', shortDescription: 'Alpha', managed: true },
            ],
            orgName: 'fint_org',
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Adaptere' },
            { name: 'description', content: 'Liste over adaptere' },
        ]);
    });

    it('renders breadcrumbs, header and sorted adapter tabs', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('adapterIndex.pageTitle');
        expect(screen.getByRole('heading', { name: 'adapterIndex.pageTitle' })).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.getByTestId('tabs-items')).toHaveTextContent('Alpha,Zulu');
        expect(mockUseDeletedSearchParamAlert).toHaveBeenCalledTimes(1);
    });

    it('filters adapters based on search value', () => {
        render(<Index />);

        fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zul' } });

        expect(screen.getByTestId('tabs-items')).toHaveTextContent('Zulu');
        expect(screen.getByTestId('tabs-items')).not.toHaveTextContent('Alpha');
    });

    it('navigates to encoded adapter details path from tabs', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'show-first-details' }));

        expect(mockNavigate).toHaveBeenCalledWith('/adapter/a%40adapter.fint.no');
    });

    it('shows create form and submits create payload through fetcher', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'adapterIndex.createButton' }));
        expect(screen.getByTestId('create-form')).toBeInTheDocument();
        expect(screen.getByText('fint_org')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'save-create' }));
        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('name')).toBe('new-adapter');
        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post', action: '/adaptere' });
    });

    it('returns to list when create form is cancelled', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'adapterIndex.createButton' }));
        fireEvent.click(screen.getByRole('button', { name: 'cancel-create' }));

        expect(screen.queryByTestId('create-form')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'adapterIndex.createButton' })).toBeInTheDocument();
    });

    it('shows empty state when there are no adapters', () => {
        mockUseLoaderData.mockReturnValue({
            adapters: [],
            orgName: 'fint_org',
        });

        render(<Index />);

        expect(screen.getByText('adapterIndex.emptyState')).toBeInTheDocument();
        expect(screen.queryByTestId('tabs-items')).not.toBeInTheDocument();
    });

    it('action delegates to handleAdapterIndexAction', async () => {
        const args = { request: new Request('http://localhost/adaptere', { method: 'POST' }) } as any;
        const expected = { success: true };
        mockHandleAdapterIndexAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleAdapterIndexAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
