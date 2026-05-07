import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseParams,
    mockUseAlerts,
    mockHandleAdapterAction,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseParams: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleAdapterAction: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
        useFetcher: () => mockUseFetcher(),
        useParams: () => mockUseParams(),
    };
});

vi.mock('novari-frontend-components', () => ({
    NovariToaster: ({ items }: { items: unknown[] }) => (
        <div data-testid="toaster">alerts:{items.length}</div>
    ),
    useAlerts: () => mockUseAlerts(),
}));

vi.mock('~/routes/adapter.$id/actions', () => ({
    handleAdapterAction: mockHandleAdapterAction,
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

vi.mock('~/components/shared/GeneralDetailView', () => ({
    GeneralDetailView: ({
        onUpdate,
        onDelete,
    }: {
        onUpdate: (formData: FormData) => void;
        onDelete: (formData: FormData) => void;
    }) => (
        <div>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('shortDescription', 'Kort');
                    onUpdate(formData);
                }}>
                update-adapter
            </button>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    onDelete(formData);
                }}>
                delete-adapter
            </button>
        </div>
    ),
}));

vi.mock('~/components/shared/AuthTable', () => ({
    AuthTable: ({
        onUpdatePassword,
        onUpdateAuthInfo,
        clientSecret,
    }: {
        onUpdatePassword: (formData: FormData) => void;
        onUpdateAuthInfo: (formData: FormData) => void;
        clientSecret?: string;
    }) => (
        <div>
            <div data-testid="client-secret">{clientSecret ?? 'none'}</div>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('entityName', 'adapter@fint.no');
                    formData.append('password', 'pw');
                    onUpdatePassword(formData);
                }}>
                update-password
            </button>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('entityName', 'adapter@fint.no');
                    onUpdateAuthInfo(formData);
                }}>
                get-secret
            </button>
        </div>
    ),
}));

vi.mock('~/routes/komponenter._index/ComponentsTable', () => ({
    default: ({
        toggle,
        selectedItems,
        isManaged,
        fromAdapter,
    }: {
        toggle: (formData: FormData) => void;
        selectedItems: string[];
        isManaged: boolean;
        fromAdapter: string;
    }) => (
        <div>
            <div data-testid="selected-components">{selectedItems.join(',')}</div>
            <div data-testid="components-meta">
                {String(isManaged)}:{fromAdapter}
            </div>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('componentName', 'Comp A');
                    formData.append('isChecked', 'true');
                    toggle(formData);
                }}>
                toggle-component
            </button>
        </div>
    ),
}));

import Index, { action, meta } from './route';

describe('adapter detail route', () => {
    const mockSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseParams.mockReturnValue({ id: 'adapter@fint.no' });
        mockUseAlerts.mockReturnValue({ alertState: [{ message: 'ok' }] });
        mockUseFetcher.mockReturnValue({
            data: { clientSecret: 'super-secret' },
            state: 'idle',
            submit: mockSubmit,
        });
        mockUseLoaderData.mockReturnValue({
            adapters: [
                {
                    name: 'adapter@fint.no',
                    managed: false,
                    components: ['dn.component.a', 'dn.unknown'],
                },
            ],
            components: [
                { dn: 'dn.component.a', name: 'Comp A' },
                { dn: 'dn.component.b', name: 'Comp B' },
            ],
            orgName: 'fint-org',
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Adapter Detaljer' },
            { name: 'description', content: 'Adapter Detaljer' },
        ]);
    });

    it('renders adapter details with selected components and auth section', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent(
            /^(Adaptere|menu\.adapters) > adapter@fint\.no$/
        );
        expect(screen.getByRole('heading', { name: 'adapter' })).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.getByTestId('selected-components')).toHaveTextContent('Comp A');
        expect(screen.getByTestId('components-meta')).toHaveTextContent('false:adapter@fint.no');
        expect(screen.getByTestId('client-secret')).toHaveTextContent('super-secret');
    });

    it('hides auth section for managed adapters', () => {
        mockUseLoaderData.mockReturnValue({
            adapters: [
                {
                    name: 'adapter@fint.no',
                    managed: true,
                    components: [],
                },
            ],
            components: [],
            orgName: 'fint-org',
        });

        render(<Index />);

        expect(screen.queryByTestId('client-secret')).not.toBeInTheDocument();
    });

    it('submits expected action types from child callbacks', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'update-adapter' }));
        fireEvent.click(screen.getByRole('button', { name: 'delete-adapter' }));
        fireEvent.click(screen.getByRole('button', { name: 'toggle-component' }));
        fireEvent.click(screen.getByRole('button', { name: 'update-password' }));
        fireEvent.click(screen.getByRole('button', { name: 'get-secret' }));

        expect(mockSubmit).toHaveBeenCalledTimes(5);

        const updateFormData = mockSubmit.mock.calls[0][0] as FormData;
        expect(updateFormData.get('actionType')).toBe('UPDATE_ADAPTER');

        const deleteFormData = mockSubmit.mock.calls[1][0] as FormData;
        expect(deleteFormData.get('actionType')).toBe('DELETE_ADAPTER');

        const toggleFormData = mockSubmit.mock.calls[2][0] as FormData;
        expect(toggleFormData.get('actionType')).toBe('UPDATE_COMPONENT_IN_ADAPTER');
        expect(toggleFormData.get('adapterName')).toBe('adapter@fint.no');
        expect(toggleFormData.getAll('componentName')).toContain('Comp A');
        expect(toggleFormData.getAll('isChecked')).toContain('true');

        const passwordFormData = mockSubmit.mock.calls[3][0] as FormData;
        expect(passwordFormData.get('actionType')).toBe('UPDATE_PASSWORD');

        const secretFormData = mockSubmit.mock.calls[4][0] as FormData;
        expect(secretFormData.get('actionType')).toBe('GET_SECRET');
    });

    it('shows fallback title when adapter is missing', () => {
        mockUseLoaderData.mockReturnValue({
            adapters: [],
            components: [],
            orgName: 'fint-org',
        });

        render(<Index />);

        expect(
            screen.getByRole('heading', { name: /^(Error|Feil|mainRoutes\.adapterDetails\.errorTitle)$/ })
        ).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'update-adapter' })).not.toBeInTheDocument();
    });

    it('action delegates to handleAdapterAction', async () => {
        const args = {
            request: new Request('http://localhost'),
            params: { id: 'adapter@fint.no' },
        } as any;
        const expected = { success: true };
        mockHandleAdapterAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleAdapterAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
