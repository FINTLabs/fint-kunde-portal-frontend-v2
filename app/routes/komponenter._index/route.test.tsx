import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseAlerts,
    mockHandleComponentIndexAction,
    mockComponentsTableProps,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleComponentIndexAction: vi.fn(),
    mockComponentsTableProps: vi.fn(),
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
    useAlerts: () => mockUseAlerts(),
}));

vi.mock('~/routes/komponenter._index/actions', () => ({
    handleComponentIndexAction: mockHandleComponentIndexAction,
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

vi.mock('~/routes/komponenter._index/ComponentsTable', () => ({
    default: (props: {
        items: Array<{ name: string; organisations: string[] }>;
        selectedItems: string[];
        toggle: (formData: FormData) => void;
    }) => {
        mockComponentsTableProps(props);
        return (
            <div>
                <div data-testid="selected-items">{props.selectedItems.join(',')}</div>
                <div data-testid="component-count">{props.items.length}</div>
                <button
                    type="button"
                    onClick={() => {
                        const formData = new FormData();
                        formData.append('componentName', 'utdanning-larling');
                        formData.append('isChecked', 'true');
                        props.toggle(formData);
                    }}>
                    toggle-component
                </button>
            </div>
        );
    },
}));

import Index, { action, meta } from './route';

describe('komponenter index route', () => {
    const mockSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFetcher.mockReturnValue({
            data: {},
            state: 'idle',
            submit: mockSubmit,
        });
        mockUseAlerts.mockReturnValue({
            alertState: [{ message: 'ok' }],
        });
        mockUseLoaderData.mockReturnValue({
            orgName: 'fint-org',
            components: [
                {
                    name: 'utdanning-larling',
                    organisations: ['fint-org'],
                },
                {
                    name: 'okonomi-faktura',
                    organisations: ['other-org'],
                },
            ],
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Komponenter' },
            { name: 'description', content: 'Liste over komponenter' },
        ]);
    });

    it('renders breadcrumbs, header and selected components for current org', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.components');
        expect(screen.getByRole('heading', { name: 'menu.components' })).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.getByTestId('selected-items')).toHaveTextContent('utdanning-larling');
        expect(screen.getByTestId('component-count')).toHaveTextContent('2');
    });

    it('submits toggle payload through fetcher', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'toggle-component' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('componentName')).toBe('utdanning-larling');
        expect(formData.get('isChecked')).toBe('true');
        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post' });
    });

    it('action delegates to handleComponentIndexAction', async () => {
        const args = { request: new Request('http://localhost/komponenter', { method: 'POST' }) } as any;
        const expected = { success: true };
        mockHandleComponentIndexAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleComponentIndexAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
