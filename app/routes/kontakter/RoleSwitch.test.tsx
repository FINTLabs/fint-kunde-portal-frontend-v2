import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RolesSwitch from './RoleSwitch';
import type { IContact } from '~/types/Contact';
import type { IRole } from '~/types/Role';

const contact: IContact = {
    dn: 'dn-1',
    nin: '12345678901',
    firstName: 'Ola',
    lastName: 'Nordmann',
    mail: 'ola@test.no',
    mobile: '12345678',
    roles: ['ROLE_USER@fint-org'],
};

const rolesData: IRole[] = [
    {
        id: 'ROLE_USER',
        name: 'Bruker',
        description: 'Standard bruker...Mer info',
        uri: null,
    },
    {
        id: 'ROLE_ADMIN',
        name: 'Admin',
        description: 'Administrator...Full tilgang',
        uri: null,
    },
];

describe('RolesSwitch', () => {
    const selectedOrg = 'fint-org';
    const hasRole = (currentContact: IContact, roleId: string) =>
        currentContact.roles?.includes(`${roleId}@${selectedOrg}`) ?? false;

    it('submits ADD_ROLE when a switch is enabled', () => {
        const updateRole = vi.fn();

        render(
            <RolesSwitch
                contact={contact}
                rolesData={rolesData}
                hasRole={hasRole}
                updateRole={updateRole}
            />
        );

        fireEvent.click(screen.getByRole('checkbox', { name: 'Admin' }));

        expect(updateRole).toHaveBeenCalledTimes(1);
        const formData = updateRole.mock.calls[0][0] as FormData;
        expect(formData.get('contactNin')).toBe('12345678901');
        expect(formData.get('roleId')).toBe('ROLE_ADMIN');
        expect(formData.get('roleName')).toBe('Admin');
        expect(formData.get('isChecked')).toBe('true');
    });

    it('disables non-admin switches when contact is admin', () => {
        render(
            <RolesSwitch
                contact={{ ...contact, roles: ['ROLE_ADMIN@fint-org'] }}
                rolesData={rolesData}
                hasRole={hasRole}
                updateRole={vi.fn()}
            />
        );

        expect(screen.getByRole('checkbox', { name: 'Admin' })).toBeEnabled();
        expect(screen.getByRole('checkbox', { name: 'Bruker' })).toBeDisabled();
    });
});
