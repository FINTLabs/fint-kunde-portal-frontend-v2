import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RoleTags from './RoleTags';
import type { IContact } from '~/types/Contact';

function makeContact(overrides: Partial<IContact> = {}): IContact {
    return {
        dn: 'dn-1',
        nin: '12345678901',
        firstName: 'Ola',
        lastName: 'Nordmann',
        mail: 'ola@test.no',
        mobile: '12345678',
        roles: [],
        ...overrides,
    };
}

describe('RoleTags', () => {
    const selectedOrg = 'fint-org';
    const hasRole = (contact: IContact, roleId: string) =>
        contact.roles?.includes(`${roleId}@${selectedOrg}`) ?? false;
    const getUserRolesForOrg = (contact: IContact) =>
        contact.roles
            ?.filter((role) => role.endsWith(`@${selectedOrg}`))
            .map((role) => role.split('@')[0]) ?? [];

    it('shows Admin tag when contact has admin role', () => {
        render(
            <RoleTags
                contact={makeContact({ roles: ['ROLE_ADMIN@fint-org'] })}
                hasRole={hasRole}
                getUserRolesForOrg={getUserRolesForOrg}
            />
        );

        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('shows mapped role tags and filters dashboard/support roles', () => {
        render(
            <RoleTags
                contact={makeContact({
                    roles: [
                        'ROLE_USER@fint-org',
                        'ROLE_DASHBOARD@fint-org',
                        'ROLE_SUPPORT@fint-org',
                    ],
                })}
                hasRole={hasRole}
                getUserRolesForOrg={() => ['Bruker', 'ROLE_DASHBOARD', 'ROLE_SUPPORT']}
            />
        );

        expect(screen.getByText('Bruker')).toBeInTheDocument();
        expect(screen.queryByText('ROLE_DASHBOARD')).not.toBeInTheDocument();
        expect(screen.queryByText('ROLE_SUPPORT')).not.toBeInTheDocument();
    });
});
