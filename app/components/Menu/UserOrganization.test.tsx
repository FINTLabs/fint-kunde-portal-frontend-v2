import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UserOrganization } from './UserOrganization';

const { mockUseSubmit } = vi.hoisted(() => ({
    mockUseSubmit: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useSubmit: () => mockUseSubmit,
    };
});

const createSession = (organizations: Array<{ name: string; displayName: string }>, selectedName?: string) =>
    ({
        meData: {},
        organizationCount: organizations.length,
        selectedOrganization: organizations.find((org) => org.name === selectedName) ?? organizations[0],
        organizations: organizations.map((org) => ({
            ...org,
            dn: '',
            orgNumber: '',
            components: [],
            legalContact: '',
            techicalContacts: [],
            k8sSize: '',
            customer: false,
            primaryAssetId: null,
        })),
        features: {},
        selectedEnv: 'beta',
    }) as any;

describe('UserOrganization', () => {
    it('renders display name when user has a single organization', () => {
        render(
            <UserOrganization
                userSession={createSession([{ name: 'org-a', displayName: 'Org A' }], 'org-a')}
            />
        );

        expect(screen.getByText('Org A')).toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('renders a select and submits update when organization changes', () => {
        render(
            <UserOrganization
                userSession={createSession(
                    [
                        { name: 'org-a', displayName: 'Org A' },
                        { name: 'org-b', displayName: 'Org B' },
                    ],
                    'org-a'
                )}
            />
        );

        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('org-a');
        expect(screen.getByRole('option', { name: 'Org A' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Org B' })).toBeInTheDocument();

        fireEvent.change(select, { target: { value: 'org-b' } });

        expect(mockUseSubmit).toHaveBeenCalledWith(
            {
                selectedOrganization: 'org-b',
                actionType: 'UPDATE_SELECTED_ORGANIZATION',
            },
            {
                method: 'POST',
                navigate: false,
            }
        );
    });
});
