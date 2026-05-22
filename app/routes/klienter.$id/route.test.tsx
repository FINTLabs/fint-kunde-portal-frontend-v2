import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseParams,
    mockUseAlerts,
    mockHandleClientAction,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseParams: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleClientAction: vi.fn(),
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

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('novari-frontend-components', () => ({
    NovariToaster: ({ items }: { items: unknown[] }) => (
        <div data-testid="toaster">alerts:{items.length}</div>
    ),
    useAlerts: () => mockUseAlerts(),
}));

vi.mock('~/routes/klienter.$id/actions', () => ({
    handleClientAction: mockHandleClientAction,
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

vi.mock('~/routes/klienter.$id/DetailView', () => ({
    DetailView: ({
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
                    formData.append('note', 'Notat');
                    formData.append('modelVersion', 'V4');
                    onUpdate(formData);
                }}>
                update-client
            </button>
            <button
                type="button"
                onClick={() => {
                    onDelete(new FormData());
                }}>
                delete-client
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
                    formData.append('entityName', 'client-a');
                    formData.append('password', 'pw');
                    onUpdatePassword(formData);
                }}>
                update-password
            </button>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('entityName', 'client-a');
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
        fromClient,
    }: {
        toggle: (formData: FormData) => void;
        selectedItems: string[];
        isManaged: boolean;
        fromClient: string;
    }) => (
        <div>
            <div data-testid="selected-components">{selectedItems.join(',')}</div>
            <div data-testid="components-meta">
                {String(isManaged)}:{fromClient}
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

vi.mock('~/routes/klienter.$id/ComponentList', () => ({
    default: ({
        onToggle,
        entity,
    }: {
        onToggle: (formData: FormData) => void;
        entity: string;
    }) => (
        <div>
            <div data-testid="component-list-entity">{entity}</div>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('componentName', 'utdanning-larling');
                    formData.append('isChecked', 'true');
                    onToggle(formData);
                }}>
                toggle-access-component
            </button>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    onToggle(formData);
                }}>
                update-environment
            </button>
        </div>
    ),
}));

import ClientDetails, { action } from './route';

const baseClient = {
    name: 'client-a',
    shortDescription: 'Client A',
    note: 'Note',
    managed: false,
    components: ['dn.component.a'],
};

describe('klienter detail route', () => {
    const mockSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseParams.mockReturnValue({ id: 'client-a' });
        mockUseAlerts.mockReturnValue({ alertState: [{ message: 'ok' }] });
        mockUseFetcher.mockReturnValue({
            data: { clientSecret: 'super-secret' },
            state: 'idle',
            submit: mockSubmit,
        });
        mockUseLoaderData.mockReturnValue({
            client: baseClient,
            access: null,
            accessComponentList: [],
            accessAuditLogs: null,
            accessLog: null,
            hasAccessControl: false,
            components: [{ dn: 'dn.component.a', name: 'Comp A' }],
        });
    });

    it('renders client details with selected components and auth section', () => {
        render(<ClientDetails />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.clients > client-a');
        expect(screen.getByRole('heading', { name: 'Client A' })).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.getByTestId('selected-components')).toHaveTextContent('Comp A');
        expect(screen.getByTestId('components-meta')).toHaveTextContent('false:client-a');
        expect(screen.getByTestId('client-secret')).toHaveTextContent('super-secret');
    });

    it('hides auth section for managed clients', () => {
        mockUseLoaderData.mockReturnValue({
            client: { ...baseClient, managed: true },
            access: null,
            accessComponentList: [],
            accessAuditLogs: null,
            accessLog: null,
            hasAccessControl: false,
            components: [],
        });

        render(<ClientDetails />);

        expect(screen.queryByTestId('client-secret')).not.toBeInTheDocument();
    });

    it('shows setup access section when access control is enabled without access', () => {
        mockUseLoaderData.mockReturnValue({
            client: baseClient,
            access: null,
            accessComponentList: [],
            accessAuditLogs: null,
            accessLog: null,
            hasAccessControl: true,
            components: [],
        });

        render(<ClientDetails />);

        expect(screen.getByText('mainRoutes.clientDetails.notEnabledTitle')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'mainRoutes.clientDetails.setupAccessButton' })).toBeInTheDocument();
    });

    it('shows access control UI when access exists', () => {
        mockUseLoaderData.mockReturnValue({
            client: baseClient,
            access: {
                username: 'client-a',
                isAdapter: false,
                environments: { api: true, beta: false, alpha: false, pwf: false },
            },
            accessComponentList: [{ domain: 'utdanning', packages: [] }],
            accessAuditLogs: null,
            accessLog: null,
            hasAccessControl: true,
            components: [],
        });

        render(<ClientDetails />);

        expect(screen.getByText('mainRoutes.clientDetails.accessControlHeading')).toBeInTheDocument();
        expect(screen.getByTestId('component-list-entity')).toHaveTextContent('client-a');
    });

    it('submits expected action types from child callbacks', () => {
        render(<ClientDetails />);

        fireEvent.click(screen.getByRole('button', { name: 'update-client' }));
        fireEvent.click(screen.getByRole('button', { name: 'delete-client' }));
        fireEvent.click(screen.getByRole('button', { name: 'toggle-component' }));
        fireEvent.click(screen.getByRole('button', { name: 'update-password' }));
        fireEvent.click(screen.getByRole('button', { name: 'get-secret' }));

        expect(mockSubmit).toHaveBeenCalledTimes(5);

        const updateFormData = mockSubmit.mock.calls[0][0] as FormData;
        expect(updateFormData.get('actionType')).toBe('UPDATE_CLIENT');
        expect(updateFormData.get('clientId')).toBe('client-a');

        const deleteFormData = mockSubmit.mock.calls[1][0] as FormData;
        expect(deleteFormData.get('actionType')).toBe('DELETE_CLIENT');
        expect(deleteFormData.get('clientId')).toBe('client-a');

        const toggleFormData = mockSubmit.mock.calls[2][0] as FormData;
        expect(toggleFormData.get('actionType')).toBe('ADD_COMPONENT_ACCESS');
        expect(toggleFormData.get('username')).toBe('client-a');
        expect(toggleFormData.get('componentName')).toBe('Comp A');
        expect(toggleFormData.get('enabled')).toBe('true');

        const passwordFormData = mockSubmit.mock.calls[3][0] as FormData;
        expect(passwordFormData.get('actionType')).toBe('UPDATE_PASSWORD');

        const secretFormData = mockSubmit.mock.calls[4][0] as FormData;
        expect(secretFormData.get('actionType')).toBe('GET_SECRET');
    });

    it('submits ADD_ACCESS when setup access is clicked', () => {
        mockUseLoaderData.mockReturnValue({
            client: baseClient,
            access: null,
            accessComponentList: [],
            accessAuditLogs: null,
            accessLog: null,
            hasAccessControl: true,
            components: [],
        });

        render(<ClientDetails />);

        fireEvent.click(screen.getByRole('button', { name: 'mainRoutes.clientDetails.setupAccessButton' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('ADD_ACCESS');
        expect(formData.get('username')).toBe('client-a');
        expect(formData.get('clientId')).toBe('client-a');
    });

    it('shows not found alert when client is missing', () => {
        mockUseLoaderData.mockReturnValue({
            client: null,
            access: null,
            accessComponentList: [],
            accessAuditLogs: null,
            accessLog: null,
            hasAccessControl: false,
            components: [],
        });

        render(<ClientDetails />);

        expect(screen.getByText('mainRoutes.clientDetails.notFoundTitle')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'update-client' })).not.toBeInTheDocument();
    });

    it('action delegates to handleClientAction', async () => {
        const args = {
            request: new Request('http://localhost/klienter/client-a'),
            params: { id: 'client-a' },
        } as any;
        const expected = { success: true };
        mockHandleClientAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleClientAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
