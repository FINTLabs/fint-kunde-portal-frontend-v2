import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseParams,
    mockUseAlerts,
    mockHandleAssetAction,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseParams: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleAssetAction: vi.fn(),
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

vi.mock('~/routes/ressurser.$id/actions', () => ({
    handleAssetAction: mockHandleAssetAction,
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

vi.mock('~/routes/ressurser.$id/DetailsView', () => ({
    DetailsView: ({
        onUpdate,
        onDelete,
    }: {
        onUpdate: (formData: FormData) => void;
        onDelete: () => void;
    }) => (
        <div>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('assetDescription', 'Updated');
                    onUpdate(formData);
                }}>
                update-asset
            </button>
            <button type="button" onClick={onDelete}>
                delete-asset
            </button>
        </div>
    ),
}));

vi.mock('~/routes/ressurser.$id/TabsComponent', () => ({
    default: ({
        unmanagedAdapters,
        unmanagedClients,
        onAdapterSwitchChange,
        onClientSwitchChange,
    }: {
        unmanagedAdapters: Array<{ name: string }>;
        unmanagedClients: Array<{ name: string }>;
        onAdapterSwitchChange: (name: string, checked: boolean) => void;
        onClientSwitchChange: (name: string, checked: boolean) => void;
    }) => (
        <div data-testid="tabs-component">
            <div data-testid="adapter-names">
                {unmanagedAdapters.map((adapter) => adapter.name).join(',')}
            </div>
            <div data-testid="client-names">
                {unmanagedClients.map((client) => client.name).join(',')}
            </div>
            <button type="button" onClick={() => onAdapterSwitchChange('adapter-a', true)}>
                toggle-adapter
            </button>
            <button type="button" onClick={() => onClientSwitchChange('client-a', false)}>
                toggle-client
            </button>
        </div>
    ),
}));

import Index, { action, handle, meta } from './route';
import type { IAdapter } from '~/types/Adapter';
import type { IAsset } from '~/types/Asset';
import type { IClient } from '~/types/Clients';

function makeAsset(overrides: Partial<IAsset> = {}): IAsset {
    return {
        dn: 'dn-asset-1',
        name: 'asset-a',
        assetId: 'asset-id-1',
        description: 'Asset description',
        organisation: 'fint-org',
        clients: [],
        adapters: [],
        primaryAsset: false,
        ...overrides,
    };
}

function makeAdapter(name: string, managed = false): IAdapter {
    return {
        dn: `dn-${name}`,
        name,
        shortDescription: `${name} desc`,
        note: '',
        clientId: 'client-a',
        components: [],
        assets: [],
        assetIds: [],
        managed,
    };
}

function makeClient(name: string, managed = false): IClient {
    return {
        dn: `dn-${name}`,
        name,
        shortDescription: `${name} desc`,
        note: '',
        assetId: [],
        asset: '',
        clientId: name,
        components: [],
        accessPackages: [],
        managed,
    };
}

describe('ressurser detail route', () => {
    const mockSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseParams.mockReturnValue({ id: 'asset-a' });
        mockUseFetcher.mockReturnValue({
            data: undefined,
            state: 'idle',
            submit: mockSubmit,
        });
        mockUseAlerts.mockReturnValue({
            alertState: [{ message: 'ok' }],
        });
        mockUseLoaderData.mockReturnValue({
            asset: makeAsset(),
            adapters: [
                makeAdapter('adapter-z', false),
                makeAdapter('adapter-a', false),
                makeAdapter('adapter-managed', true),
            ],
            clients: [
                makeClient('client-z', false),
                makeClient('client-a', false),
                makeClient('client-managed', true),
            ],
            assets: [makeAsset(), makeAsset({ name: 'primary-asset', primaryAsset: true })],
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Ressurser' },
            { name: 'description', content: 'Liste over ressurser' },
        ]);
    });

    it('handle exports analytics metadata', () => {
        expect(handle).toEqual({
            analytics: {
                pageType: 'ressurser',
                pathPattern: '/ressurser/:id',
            },
        });
    });

    it('renders breadcrumbs, header, details and tabs for existing asset', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.resources > asset-a');
        expect(screen.getByRole('heading', { name: 'menu.resources' })).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.getByTestId('tabs-component')).toBeInTheDocument();
        expect(screen.getByTestId('adapter-names')).toHaveTextContent('adapter-a,adapter-z');
        expect(screen.getByTestId('client-names')).toHaveTextContent('client-a,client-z');
    });

    it('renders not found alert when asset is missing', () => {
        mockUseLoaderData.mockReturnValue({
            asset: null,
            adapters: [],
            clients: [],
            assets: [],
        });

        render(<Index />);

        expect(screen.getByText('mainRoutes.resourcesDetails.notFoundTitle')).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.resourcesDetails.notFoundDescription')).toBeInTheDocument();
        expect(screen.queryByTestId('tabs-component')).not.toBeInTheDocument();
    });

    it('submits UPDATE when asset is updated', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'update-asset' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('UPDATE');
        expect(formData.get('assetId')).toBe('asset-id-1');
        expect(formData.get('assetDescription')).toBe('Updated');
        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post' });
    });

    it('submits DELETE when asset is deleted', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'delete-asset' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('DELETE');
        expect(formData.get('assetName')).toBe('asset-a');
    });

    it('submits adapter and client updates with primary asset name', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'toggle-adapter' }));
        fireEvent.click(screen.getByRole('button', { name: 'toggle-client' }));

        expect(mockSubmit).toHaveBeenCalledTimes(2);

        const adapterData = mockSubmit.mock.calls[0][0];
        expect(adapterData).toEqual({
            adapterName: 'adapter-a',
            assetName: 'asset-a',
            updateType: 'add',
            actionType: 'UPDATE_ADAPTER',
        });
        expect(mockSubmit.mock.calls[0][1]).toEqual({
            method: 'post',
            action: '/ressurser/asset-a',
        });

        const clientData = mockSubmit.mock.calls[1][0];
        expect(clientData).toEqual({
            clientName: 'client-a',
            assetName: 'asset-a',
            updateType: 'remove',
            actionType: 'UPDATE_CLIENT',
            primaryAssetDN: 'primary-asset',
        });
    });

    it('action delegates to handleAssetAction', async () => {
        const args = { request: new Request('http://localhost/ressurser/asset-a', { method: 'POST' }) } as any;
        const expected = { success: true };
        mockHandleAssetAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleAssetAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
