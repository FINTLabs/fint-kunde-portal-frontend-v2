import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseNavigate,
    mockUseSearchParams,
    mockUseAlerts,
    mockHandleAccessElementAction,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseNavigate: vi.fn(),
    mockUseSearchParams: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleAccessElementAction: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
        useFetcher: () => mockUseFetcher(),
        useNavigate: () => mockUseNavigate(),
        useSearchParams: () => mockUseSearchParams(),
    };
});

vi.mock('~/api/AccessApi', () => ({
    default: {
        getComponentAccess: vi.fn(),
    },
}));

vi.mock('novari-frontend-components', () => ({
    NovariToaster: ({ items }: { items: unknown[] }) => (
        <div data-testid="toaster">alerts:{items.length}</div>
    ),
    useAlerts: () => mockUseAlerts(),
}));

vi.mock('~/routes/tilgang/id/component/actions', () => ({
    handleAccessElementAction: mockHandleAccessElementAction,
}));

vi.mock('~/components/shared/breadcrumbs', () => ({
    default: ({ breadcrumbs }: { breadcrumbs: { name: string; link: string }[] }) => (
        <div data-testid="breadcrumbs">
            {breadcrumbs.map((b) => `${b.name}:${b.link}`).join(' > ')}
        </div>
    ),
}));

vi.mock('~/components/shared/InternalPageHeader', () => ({
    InternalPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('~/routes/tilgang/id/component/ResourcesList', () => ({
    default: ({
        onSelected,
        onToggle,
        onBulkToggle,
    }: {
        onSelected: (resourceName: string) => void;
        onToggle: (formData: FormData) => void;
        onBulkToggle: (formData: FormData) => void;
    }) => (
        <div data-testid="resources-list">
            <button type="button" onClick={() => onSelected('elev')}>
                open-resource
            </button>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('resource', 'elev');
                    formData.append('enabled', 'true');
                    onToggle(formData);
                }}>
                toggle-resource
            </button>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('resources', '[]');
                    onBulkToggle(formData);
                }}>
                bulk-toggle
            </button>
        </div>
    ),
}));

import Route, { action } from './route';

describe('tilgang component route', () => {
    const mockSubmit = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
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
            clientOrAdapter: 'client-a@client.fint.no',
            component: 'utdanning-elev',
            resourceList: [{ name: 'elev', enabled: true }],
        });
    });

    it('renders client breadcrumbs and resources list', () => {
        render(<Route />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('klienter:/klienter');
        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent(
            'client-a@client.fint.no:/klienter/client-a@client.fint.no'
        );
        expect(screen.getByRole('heading', { name: 'Tilgang - klienter' })).toBeInTheDocument();
        expect(screen.getByTestId('resources-list')).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
    });

    it('uses adapter breadcrumb path for non-client entities', () => {
        mockUseLoaderData.mockReturnValue({
            clientOrAdapter: 'adapter-a@adapter.fint.no',
            component: 'utdanning-elev',
            resourceList: [],
        });

        render(<Route />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('adapter:/adapter');
        expect(screen.getByRole('heading', { name: 'Tilgang - adapter' })).toBeInTheDocument();
    });

    it('adds success alert when addedNew search param is true', () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams('addedNew=true')]);

        render(<Route />);

        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:2');
    });

    it('navigates to resource detail when resource is selected', () => {
        render(<Route />);

        fireEvent.click(screen.getByRole('button', { name: 'open-resource' }));

        expect(mockNavigate).toHaveBeenCalledWith(
            '/tilgang/client-a@client.fint.no/utdanning-elev/elev'
        );
    });

    it('submits resource toggle and bulk toggle actions', () => {
        render(<Route />);

        fireEvent.click(screen.getByRole('button', { name: 'toggle-resource' }));
        fireEvent.click(screen.getByRole('button', { name: 'bulk-toggle' }));

        expect(mockSubmit).toHaveBeenCalledTimes(2);

        const toggleData = mockSubmit.mock.calls[0][0] as FormData;
        expect(toggleData.get('actionType')).toBe('ENABLE_RESOURCE');
        expect(toggleData.get('username')).toBe('client-a@client.fint.no');
        expect(toggleData.get('component')).toBe('utdanning-elev');
        expect(toggleData.get('resource')).toBe('elev');
        expect(toggleData.get('enabled')).toBe('true');

        const bulkData = mockSubmit.mock.calls[1][0] as FormData;
        expect(bulkData.get('actionType')).toBe('ENABLE_ALL_RESOURCES');
        expect(bulkData.get('username')).toBe('client-a@client.fint.no');
        expect(bulkData.get('component')).toBe('utdanning-elev');
    });

    it('action delegates to handleAccessElementAction', async () => {
        const args = {
            request: new Request('http://localhost/tilgang/client-a/utdanning-elev', {
                method: 'POST',
            }),
        } as any;
        const expected = { success: true };
        mockHandleAccessElementAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleAccessElementAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
