import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseSearchParams,
    mockUseAlerts,
    mockHandleFieldAccessAction,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseSearchParams: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleFieldAccessAction: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
        useFetcher: () => mockUseFetcher(),
        useSearchParams: () => mockUseSearchParams(),
    };
});

vi.mock('~/api/AccessApi', () => ({
    default: {
        getResourceAccess: vi.fn(),
        getFieldAccess: vi.fn(),
    },
}));

vi.mock('novari-frontend-components', () => ({
    NovariToaster: ({ items }: { items: unknown[] }) => (
        <div data-testid="toaster">alerts:{items.length}</div>
    ),
    useAlerts: () => mockUseAlerts(),
}));

vi.mock('~/routes/tilgang/id/component/resource/actions', () => ({
    handleFieldAccessAction: mockHandleFieldAccessAction,
}));

vi.mock('~/components/shared/breadcrumbs', () => ({
    default: ({ breadcrumbs }: { breadcrumbs: { name: string; link: string }[] }) => (
        <div data-testid="breadcrumbs">
            {breadcrumbs.map((b) => `${b.name}:${b.link}`).join(' > ')}
        </div>
    ),
}));

vi.mock('~/components/shared/InternalPageHeader', () => ({
    default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('~/routes/tilgang/id/component/resource/FieldList', () => ({
    default: ({ onToggleField }: { onToggleField: (fieldName: string, enabled: boolean) => void }) => (
        <button type="button" onClick={() => onToggleField('systemId', true)}>
            toggle-field
        </button>
    ),
}));

vi.mock('~/routes/tilgang/id/component/resource/IconToggleButtons', () => ({
    default: ({
        onClickReadingOptions,
        onClickIsWriteable,
    }: {
        onClickReadingOptions: () => void;
        onClickIsWriteable: () => void;
    }) => (
        <div>
            <button type="button" onClick={onClickReadingOptions}>
                toggle-reading
            </button>
            <button type="button" onClick={onClickIsWriteable}>
                toggle-writeable
            </button>
        </div>
    ),
}));

import Route, { action } from './route';

describe('tilgang resource route', () => {
    const mockSubmit = vi.fn();
    const baseResource = {
        name: 'elev',
        enabled: true,
        writeable: false,
        readingOption: 'MULTIPLE' as const,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
        mockUseFetcher.mockReturnValue({
            data: undefined,
            state: 'idle',
            submit: mockSubmit,
        });
        mockUseAlerts.mockReturnValue({
            alertState: [{ message: 'ok' }],
        });
        mockUseLoaderData.mockReturnValue({
            clientOrAdapter: 'client-a@client.fint.no',
            componentName: 'utdanning-elev',
            resource: baseResource,
            fieldList: [{ name: 'systemId', enabled: true, mustContain: '', relation: false }],
        });
    });

    it('renders breadcrumbs, header and resource details', () => {
        render(<Route />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('klienter:/klienter');
        expect(screen.getByRole('heading', { name: 'client-a@client.fint.no' })).toBeInTheDocument();
        expect(screen.getByText('utdanning-elev/elev')).toBeInTheDocument();
        expect(screen.getByText('Skriverettighet: Nei')).toBeInTheDocument();
        expect(screen.getByText('Leseinstillinger: Alt')).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
    });

    it('uses adaptere breadcrumb path for non-client entities', () => {
        mockUseLoaderData.mockReturnValue({
            clientOrAdapter: 'adapter-a@adapter.fint.no',
            componentName: 'utdanning-elev',
            resource: baseResource,
            fieldList: [],
        });

        render(<Route />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('adaptere:/adaptere');
    });

    it('adds success alert when addedNew search param is true', () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams('addedNew=true')]);

        render(<Route />);

        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:2');
    });

    it('submits field toggle action', () => {
        render(<Route />);

        fireEvent.click(screen.getByRole('button', { name: 'toggle-field' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('ENABLE_FIELD');
        expect(formData.get('username')).toBe('client-a@client.fint.no');
        expect(formData.get('componentName')).toBe('utdanning-elev');
        expect(formData.get('resourceName')).toBe('elev');
        expect(formData.get('fieldName')).toBe('systemId');
        expect(formData.get('enabled')).toBe('true');
    });

    it('submits reading option toggle with singular value', () => {
        render(<Route />);

        fireEvent.click(screen.getByRole('button', { name: 'toggle-reading' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('UPDATE_RESOURCE');
        expect(formData.get('readingOption')).toBe('SINGULAR');
        expect(formData.get('writeable')).toBe('false');
        expect(formData.get('enabled')).toBe('true');
    });

    it('submits writeable toggle with true value', () => {
        render(<Route />);

        fireEvent.click(screen.getByRole('button', { name: 'toggle-writeable' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('UPDATE_RESOURCE');
        expect(formData.get('writeable')).toBe('true');
        expect(formData.get('readingOption')).toBe('MULTIPLE');
    });

    it('action delegates to handleFieldAccessAction', async () => {
        const args = {
            request: new Request('http://localhost/tilgang/client-a/utdanning-elev/elev', {
                method: 'POST',
            }),
        } as any;
        const expected = { success: true };
        mockHandleFieldAccessAction.mockResolvedValue(expected);

        const result = await action(args);

        expect(mockHandleFieldAccessAction).toHaveBeenCalledWith(args);
        expect(result).toEqual(expected);
    });
});
