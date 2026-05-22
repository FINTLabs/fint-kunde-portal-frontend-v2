import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ExpandableRowContent from './ExpandableRowContent';
import type { IContact } from '~/types/Contact';

vi.mock('~/routes/kontakter/RoleSwitch', () => ({
    default: () => <div data-testid="roles-switch" />,
}));

vi.mock('~/components/shared/ConfirmActionModal', () => ({
    default: ({
        buttonText,
        onConfirm,
    }: {
        buttonText: string;
        onConfirm: () => void;
    }) => (
        <button type="button" onClick={onConfirm}>
            {buttonText}
        </button>
    ),
}));

const contact: IContact = {
    dn: 'dn-1',
    nin: '12345678901',
    firstName: 'Ola',
    lastName: 'Nordmann',
    mail: 'ola@test.no',
    mobile: '12345678',
    roles: [],
};

describe('ExpandableRowContent', () => {
    it('submits legal contact update on confirm', () => {
        const handleUpdateLegalContact = vi.fn();

        render(
            <ExpandableRowContent
                contact={contact}
                rolesData={[]}
                hasRole={() => false}
                updateRole={vi.fn()}
                handleUpdateLegalContact={handleUpdateLegalContact}
                handleRemoveContact={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Sett som juridisk kontakt' }));

        expect(handleUpdateLegalContact).toHaveBeenCalledWith('12345678901');
    });

    it('submits remove contact form data on confirm', () => {
        const handleRemoveContact = vi.fn();

        render(
            <ExpandableRowContent
                contact={contact}
                rolesData={[]}
                hasRole={() => false}
                updateRole={vi.fn()}
                handleUpdateLegalContact={vi.fn()}
                handleRemoveContact={handleRemoveContact}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Fjern kontakt' }));

        expect(handleRemoveContact).toHaveBeenCalledTimes(1);
        const formData = handleRemoveContact.mock.calls[0][0] as FormData;
        expect(formData.get('contactNin')).toBe('12345678901');
    });
});
