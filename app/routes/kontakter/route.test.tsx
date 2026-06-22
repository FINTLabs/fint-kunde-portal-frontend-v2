import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockUseLoaderData,
    mockUseFetcher,
    mockUseAlerts,
    mockHandleContactsAction,
    mockContactTableProps,
    mockContactModalProps,
} = vi.hoisted(() => ({
    mockUseLoaderData: vi.fn(),
    mockUseFetcher: vi.fn(),
    mockUseAlerts: vi.fn(),
    mockHandleContactsAction: vi.fn(),
    mockContactTableProps: vi.fn(),
    mockContactModalProps: vi.fn(),
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

vi.mock('~/routes/kontakter/actions', () => ({
    handleContactsAction: mockHandleContactsAction,
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

vi.mock('~/routes/kontakter/ContactTable', () => ({
    default: (props: {
        contactsData: unknown[];
        selectedOrg: string;
        onButtonClick: (formData: FormData) => void;
    }) => {
        mockContactTableProps(props);
        return (
            <div data-testid="contact-table">
                <button
                    type="button"
                    onClick={() => {
                        const formData = new FormData();
                        formData.append('actionType', 'REMOVE_CONTACT');
                        formData.append('contactNin', '12345678901');
                        props.onButtonClick(formData);
                    }}>
                    remove-from-table
                </button>
            </div>
        );
    },
}));

vi.mock('~/routes/kontakter/ContactModal', () => ({
    default: (props: {
        isOpen: boolean;
        onAddContact: (formData: FormData) => void;
        onClose: () => void;
    }) => {
        mockContactModalProps(props);
        if (!props.isOpen) {
            return null;
        }

        return (
            <div data-testid="contact-modal">
                <button
                    type="button"
                    onClick={() => {
                        const formData = new FormData();
                        formData.append('contactNin', '99999999999');
                        props.onAddContact(formData);
                    }}>
                    add-from-modal
                </button>
                <button type="button" onClick={props.onClose}>
                    close-modal
                </button>
            </div>
        );
    },
}));

import Index, { action, meta } from './route';

describe('kontakter route', () => {
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
            legalContact: { firstName: 'Legal', lastName: 'Person' },
            technicalContacts: [{ firstName: 'Tech', lastName: 'Contact' }],
            allContacts: [{ firstName: 'All', lastName: 'Contacts' }],
            rolesData: [{ id: 'ROLE_USER', name: 'Bruker' }],
            selectedOrg: 'fint-org',
        });
    });

    it('meta returns title and description', () => {
        expect(meta({} as any)).toEqual([
            { title: 'Kontakter' },
            { name: 'description', content: 'Liste over kontakter' },
        ]);
    });

    it('renders legal contact, table and toaster', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.contacts');
        expect(screen.getByRole('heading', { name: 'menu.contacts' })).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.contacts.legalContactHeading')).toBeInTheDocument();
        expect(screen.getByText('Legal Person')).toBeInTheDocument();
        expect(screen.getByTestId('contact-table')).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toHaveTextContent('alerts:1');
    });

    it('shows fallback when legal contact is missing', () => {
        mockUseLoaderData.mockReturnValue({
            legalContact: null,
            technicalContacts: [],
            allContacts: [],
            rolesData: [],
            selectedOrg: 'fint-org',
        });

        render(<Index />);

        expect(screen.getByText('mainRoutes.contacts.noLegalContact')).toBeInTheDocument();
    });

    it('opens modal and submits add contact action', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'mainRoutes.contacts.addButton' }));
        expect(screen.getByTestId('contact-modal')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'add-from-modal' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('ADD_TECHNICAL_CONTACT');
        expect(formData.get('contactNin')).toBe('99999999999');
    });

    it('submits table actions through fetcher', () => {
        render(<Index />);

        fireEvent.click(screen.getByRole('button', { name: 'remove-from-table' }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        const formData = mockSubmit.mock.calls[0][0] as FormData;
        expect(formData.get('actionType')).toBe('REMOVE_CONTACT');
        expect(mockSubmit.mock.calls[0][1]).toEqual({ method: 'post', action: '/kontakter' });
    });

    it('action delegates to handleContactsAction', async () => {
        const request = new Request('http://localhost/kontakter', { method: 'POST' });
        const expected = { success: true };
        mockHandleContactsAction.mockResolvedValue(expected);

        const result = await action({ request } as any);

        expect(mockHandleContactsAction).toHaveBeenCalledWith(request);
        expect(result).toEqual(expected);
    });
});
