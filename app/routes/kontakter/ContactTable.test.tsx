import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ContactTable from './ContactTable';
import type { IContact } from '~/types/Contact';
import type { IRole } from '~/types/Role';

vi.mock('./ExpandableRowContent', () => ({
    default: ({
        handleUpdateLegalContact,
        handleRemoveContact,
        updateRole,
    }: {
        handleUpdateLegalContact: (contactNin: string) => void;
        handleRemoveContact: (formData: FormData) => void;
        updateRole: (formData: FormData) => void;
    }) => (
        <div>
            <button type="button" onClick={() => handleUpdateLegalContact('12345678901')}>
                set-legal
            </button>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('contactNin', '12345678901');
                    handleRemoveContact(formData);
                }}>
                remove-contact
            </button>
            <button
                type="button"
                onClick={() => {
                    const formData = new FormData();
                    formData.append('contactNin', '12345678901');
                    formData.append('roleId', 'ROLE_USER');
                    formData.append('isChecked', 'true');
                    updateRole(formData);
                }}>
                add-role
            </button>
        </div>
    ),
}));

vi.mock('./RoleTags', () => ({
    default: ({ contact }: { contact: IContact }) => (
        <div data-testid={`role-tags-${contact.nin}`}>roles</div>
    ),
}));

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
        description: 'Desc',
        uri: null,
    },
];

describe('ContactTable', () => {
    it('renders contact rows and role tags', () => {
        render(
            <ContactTable
                contactsData={[contact]}
                rolesData={rolesData}
                onButtonClick={vi.fn()}
                selectedOrg="fint-org"
            />
        );

        expect(screen.getByText('Ola Nordmann')).toBeInTheDocument();
        expect(screen.getByTestId('role-tags-12345678901')).toBeInTheDocument();
    });

    it('submits legal contact, remove contact and role updates', () => {
        const onButtonClick = vi.fn();

        render(
            <ContactTable
                contactsData={[contact]}
                rolesData={rolesData}
                onButtonClick={onButtonClick}
                selectedOrg="fint-org"
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /Vis mer/i }));
        fireEvent.click(screen.getByRole('button', { name: 'set-legal' }));
        fireEvent.click(screen.getByRole('button', { name: 'remove-contact' }));
        fireEvent.click(screen.getByRole('button', { name: 'add-role' }));

        expect(onButtonClick).toHaveBeenCalledTimes(3);

        const legalFormData = onButtonClick.mock.calls[0][0] as FormData;
        expect(legalFormData.get('actionType')).toBe('SET_LEGAL_CONTACT');
        expect(legalFormData.get('contactNin')).toBe('12345678901');

        const removeFormData = onButtonClick.mock.calls[1][0] as FormData;
        expect(removeFormData.get('actionType')).toBe('REMOVE_CONTACT');

        const roleFormData = onButtonClick.mock.calls[2][0] as FormData;
        expect(roleFormData.get('actionType')).toBe('ADD_ROLE');
    });
});
