import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Index from './route';

const mockUseOutletContext = vi.fn();
const mockUseLoaderData = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');

    return {
        ...actual,
        useOutletContext: () => mockUseOutletContext(),
        useLoaderData: () => mockUseLoaderData(),
    };
});

vi.mock('~/components/Menu/MenuConfig', () => ({
    getNovariMenu: () => [
        {
            label: 'Open page',
            action: '/open-page',
            description: 'Visible for everyone',
        },
        {
            label: 'Hidden page',
            action: '/hidden-page',
            displayBox: false,
        },
        {
            label: 'Admin section',
            submenu: [
                {
                    label: 'Protected page',
                    action: '/protected-page',
                    role: 'ROLE_PROTECTED',
                    description: 'Only for authorized users',
                },
            ],
        },
    ],
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: { name?: string }) => {
            if (key === 'home.welcome') {
                return `Velkommen til kundeportalen, ${options?.name}.`;
            }

            return key;
        },
    }),
}));

describe('Index route', () => {
    beforeEach(() => {
        mockUseOutletContext.mockReset();
        mockUseLoaderData.mockReset();
        mockUseLoaderData.mockReturnValue({ modelVersion: { V3: 0, V4: 0 } });
    });

    it('shows welcome message with first name', () => {
        mockUseOutletContext.mockReturnValue({
            selectedOrganization: { name: 'novari' },
            meData: {
                firstName: 'Jennifer',
                roles: [],
            },
        });

        render(<Index />);

        expect(
            screen.getByRole('heading', {
                name: 'Velkommen til kundeportalen, Jennifer.',
            })
        ).toBeInTheDocument();
    });

    it('shows submenu item when user has required role', () => {
        mockUseOutletContext.mockReturnValue({
            selectedOrganization: { name: 'novari' },
            meData: {
                firstName: 'Jennifer',
                roles: ['ROLE_PROTECTED@novari'],
            },
        });

        render(<Index />);

        expect(screen.getByRole('link', { name: 'Protected page' })).toBeInTheDocument();
    });

    it('hides submenu item when user does not have required role', () => {
        mockUseOutletContext.mockReturnValue({
            selectedOrganization: { name: 'novari' },
            meData: {
                firstName: 'Jennifer',
                roles: [],
            },
        });

        render(<Index />);

        expect(screen.queryByRole('link', { name: 'Protected page' })).not.toBeInTheDocument();
    });

    it('shows submenu item when user is admin for the organization', () => {
        mockUseOutletContext.mockReturnValue({
            selectedOrganization: { name: 'novari' },
            meData: {
                firstName: 'Jennifer',
                roles: ['ROLE_ADMIN@novari'],
            },
        });

        render(<Index />);

        expect(screen.getByRole('link', { name: 'Protected page' })).toBeInTheDocument();
    });

    it('does not render top-level menu items with displayBox false', () => {
        mockUseOutletContext.mockReturnValue({
            selectedOrganization: { name: 'novari' },
            meData: {
                firstName: 'Jennifer',
                roles: [],
            },
        });

        render(<Index />);

        expect(screen.queryByRole('link', { name: 'Hidden page' })).not.toBeInTheDocument();
    });
});
