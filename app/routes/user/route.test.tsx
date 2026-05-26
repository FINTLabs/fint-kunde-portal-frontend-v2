import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IMeData } from '~/types/Me';

const mockUseLoaderData = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('~/components/shared/breadcrumbs', () => ({
    default: ({ breadcrumbs }: { breadcrumbs: { name: string }[] }) => (
        <div data-testid="breadcrumbs">{breadcrumbs.map((b) => b.name).join(' > ')}</div>
    ),
}));

vi.mock('~/components/shared/InternalPageHeader', () => ({
    default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

import Index from './route';

const mockUser: IMeData = {
    dn: 'cn=Test User,ou=users',
    nin: '12345678901',
    firstName: 'Test',
    lastName: 'User',
    mail: 'test.user@example.com',
    mobile: '12345678',
    technical: [],
    legal: [],
    supportId: 'support-1',
    roles: ['ROLE_ADMIN@fint-org', 'ROLE_USER@fint-org'],
};

describe('user route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLoaderData.mockReturnValue({ user: mockUser });
    });

    it('renders breadcrumbs and header', () => {
        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('mainRoutes.user.breadcrumb');
        expect(screen.getByRole('heading', { name: 'mainRoutes.user.title' })).toBeInTheDocument();
    });

    it('renders user contact details', () => {
        render(<Index />);

        expect(screen.getByText('mainRoutes.user.fullNameLabel')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.user.emailLabel')).toBeInTheDocument();
        expect(screen.getByText('test.user@example.com')).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.user.mobileLabel')).toBeInTheDocument();
        expect(screen.getByText('12345678')).toBeInTheDocument();
    });

    it('renders user roles as tags', () => {
        render(<Index />);

        expect(screen.getByText('mainRoutes.user.rolesLabel')).toBeInTheDocument();
        mockUser.roles.forEach((role) => {
            expect(screen.getByText(role)).toBeInTheDocument();
        });
    });

    it('renders no role tags when user has no roles', () => {
        mockUseLoaderData.mockReturnValue({
            user: { ...mockUser, roles: [] },
        });

        render(<Index />);

        mockUser.roles.forEach((role) => {
            expect(screen.queryByText(role)).not.toBeInTheDocument();
        });
    });
});
