import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseAlerts,
    mockHandleRelationTestAction,
    mockRelationTestAddFormProps,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleRelationTestAction: vi.fn(),
    mockRelationTestAddFormProps: vi.fn(),
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

vi.mock('~/routes/relasjonstest/actions', () => ({
    handleRelationTestAction: mockHandleRelationTestAction,
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

vi.mock('~/routes/relasjonstest/RelationTestAddForm', () => ({
    default: ({ runTest }: { runTest: (testUrl: string) => void }) => {
        mockRelationTestAddFormProps({ runTest });
        return (
            <button
                type="button"
                onClick={() => runTest('https://play-with-fint.felleskomponent.no/utdanning')}>
                run-test
            </button>
        );
    },
}));

vi.mock('~/routes/relasjonstest/RelationTestResultsTable', () => ({
    default: ({ logResults }: { logResults: Array<{ id: string }> }) => (
        <div data-testid="results-table">{logResults.map((result) => result.id).join(',')}</div>
    ),
}));

import Index, { action, meta } from './route';

describe('relasjonstest route', () => {
    const mockSubmit = vi.fn();
    const mockLoad = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFetcher.mockReturnValue({
            data: undefined,
            state: 'idle',
            submit: mockSubmit,
            load: mockLoad,
            formData: new FormData(),
        });
        mockUseAlerts.mockReturnValue({
            alertState: [{ message: 'ok' }],
        });
        mockUseLoaderData.mockReturnValue({
            components: [{ dn: 'dn-comp-1', description: 'Comp 1' }],
            configs: [{ dn: 'dn-comp-1', path: '/utdanning' }],
            relationTests: [],
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Relasjonstest' },
            { name: 'description', content: 'Relasjonstest' },
        ]);
    });

    it('renders warning alert when there is no action data', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.relationTest');
        expect(screen.getByRole('heading', { name: 'menu.relationTest' })).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.relationTest.warningTitle')).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
        expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
    });

    it('submits ADD_TEST when runTest is triggered', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'run-test' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('ADD_TEST');
        expect(formData.get('testUrl')).toBe('https://play-with-fint.felleskomponent.no/utdanning');
        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post' });
    });

    it('renders results table and clears all tests', () => {
        mockUseLoaderData.mockReturnValue({
            components: [],
            configs: [],
            relationTests: [
                { id: 'test-1', status: 'COMPLETED', errorMessage: null },
                { id: 'test-2', status: 'FAILED', errorMessage: 'error' },
            ],
        });

        render(<Index />);

        expect(screen.getByTestId('results-table')).toHaveTextContent('test-1,test-2');
        expect(screen.getByText('mainRoutes.relationTest.warningTitle')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'mainRoutes.relationTest.removeAllButton' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('CLEAR_TESTS');
    });

    it('action delegates to handleRelationTestAction', async () => {
        const args = { request: new Request('http://localhost/relasjonstest', { method: 'POST' }) } as any;
        const expected = { success: true };
        mockHandleRelationTestAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleRelationTestAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
