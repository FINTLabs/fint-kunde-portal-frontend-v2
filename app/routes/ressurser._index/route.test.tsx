import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseNavigate,
    mockUseAlerts,
    mockHandleAssetIndexAction,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseNavigate: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleAssetIndexAction: vi.fn(),
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
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('novari-frontend-components', () => ({
    NovariToaster: ({ items }: { items: unknown[] }) => (
        <div data-testid="toaster">alerts:{items.length}</div>
    ),
    useAlerts: () => mockUseAlerts(),
}));

vi.mock('~/routes/ressurser._index/actions', () => ({
    handleAssetIndexAction: mockHandleAssetIndexAction,
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

vi.mock('~/routes/ressurser._index/CreateForm', () => ({
    default: ({
        onCancel,
        onCreate,
        primaryAsset,
    }: {
        onCancel: () => void;
        onCreate: (formData: FormData) => void;
        primaryAsset: { assetId: string };
    }) => (
        <div data-testid="create-form">
            <div>{primaryAsset.assetId}</div>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('name', 'new-asset');
                    formData.append('description', 'New asset');
                    formData.append('orgName', primaryAsset.assetId);
                    onCreate(formData);
                }}>
                save-create
            </button>
            <button type="button" onClick={onCancel}>
                cancel-create
            </button>
        </div>
    ),
}));

vi.mock('~/routes/ressurser._index/ResourcesTable', () => ({
    default: ({
        assets,
        onRowClick,
    }: {
        assets: Array<{ name: string }>;
        onRowClick: (id: string) => void;
    }) => (
        <div data-testid="assets-table">
            <div>{assets.map((asset) => asset.name).join(',')}</div>
            <button type="button" onClick={() => onRowClick(assets[0]?.name ?? '')}>
                open-first-asset
            </button>
        </div>
    ),
}));

import Index, { action, meta } from './route';
import type { IAsset } from '~/types/Asset';

function makeAsset(name: string): IAsset {
    return {
        dn: `dn-${name}`,
        name,
        assetId: `${name}-id`,
        description: `${name} description`,
        organisation: 'fint-org',
        clients: [],
        adapters: [],
        primaryAsset: false,
    };
}

describe('ressurser index route', () => {
    const mockSubmit = vi.fn();
    const mockNavigate = vi.fn();
    const primaryAsset = makeAsset('primary-asset');

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFetcher.mockReturnValue({
            data: undefined,
            state: 'idle',
            submit: mockSubmit,
        });
        mockUseNavigate.mockReturnValue(mockNavigate);
        mockUseAlerts.mockReturnValue({
            alertState: [{ message: 'ok' }],
        });
        mockUseLoaderData.mockReturnValue({
            assets: [makeAsset('asset-a'), makeAsset('asset-b')],
            primaryAsset,
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Ressurser' },
            { name: 'description', content: 'Liste over ressurser' },
        ]);
    });

    it('renders breadcrumbs, header, table and toaster', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.resources');
        expect(screen.getByRole('heading', { name: 'menu.resources' })).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.getByTestId('assets-table')).toHaveTextContent('asset-a,asset-b');
    });

    it('shows warning alert when there are no assets', () => {
        mockUseLoaderData.mockReturnValue({
            assets: [],
            primaryAsset,
        });

        render(<Index />);

        expect(screen.getByText('mainRoutes.resourcesIndex.notFoundTitle')).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.resourcesIndex.notFoundDescription')).toBeInTheDocument();
        expect(screen.queryByTestId('assets-table')).not.toBeInTheDocument();
    });

    it('navigates to asset detail when row is clicked', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'open-first-asset' }));

        expect(mockNavigate).toHaveBeenCalledWith('/ressurser/asset-a');
    });

    it('shows create form and submits CREATE action', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'mainRoutes.resourcesIndex.addButton' }));
        expect(screen.getByTestId('create-form')).toHaveTextContent('primary-asset-id');

        fireEvent.click(screen.getByRole('button', { name: 'save-create' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('CREATE');
        expect(formData.get('name')).toBe('new-asset');
        expect(formData.get('description')).toBe('New asset');
        expect(formData.get('orgName')).toBe('primary-asset-id');
        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post', action: '/ressurser' });
    });

    it('hides create form when cancelled', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'mainRoutes.resourcesIndex.addButton' }));
        expect(screen.getByTestId('create-form')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'cancel-create' }));

        expect(screen.queryByTestId('create-form')).not.toBeInTheDocument();
        expect(screen.getByTestId('assets-table')).toBeInTheDocument();
    });

    it('action delegates to handleAssetIndexAction', async () => {
        const args = { request: new Request('http://localhost/ressurser', { method: 'POST' }) } as any;
        const expected = { success: true };
        mockHandleAssetIndexAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleAssetIndexAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
