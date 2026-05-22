import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ContactModal from './ContactModal';
import type { IContact } from '~/types/Contact';

function makeContact(overrides: Partial<IContact> = {}): IContact {
    return {
        dn: 'dn-1',
        nin: '11111111111',
        firstName: 'Anna',
        lastName: 'Alpha',
        mail: 'anna@test.no',
        mobile: '12345678',
        roles: [],
        ...overrides,
    };
}

describe('ContactModal', () => {
    const contacts = [
        makeContact(),
        makeContact({
            dn: 'dn-2',
            nin: '22222222222',
            firstName: 'Ola',
            lastName: 'Nordmann',
        }),
        makeContact({
            dn: 'dn-3',
            nin: '33333333333',
            firstName: 'Per',
            lastName: 'Nordmann',
        }),
    ];

    it('filters contacts by last name prefix', () => {
        render(
            <ContactModal isOpen contacts={contacts} onClose={vi.fn()} onAddContact={vi.fn()} />
        );

        fireEvent.change(screen.getByLabelText('Filtrer kontakter'), {
            target: { value: 'Nor' },
        });

        expect(screen.getByText('Ola Nordmann')).toBeInTheDocument();
        expect(screen.getByText('Per Nordmann')).toBeInTheDocument();
        expect(screen.queryByText('Anna Alpha')).not.toBeInTheDocument();
    });

    it('shows empty state when filter has no matches', () => {
        render(
            <ContactModal isOpen contacts={contacts} onClose={vi.fn()} onAddContact={vi.fn()} />
        );

        fireEvent.change(screen.getByLabelText('Filtrer kontakter'), {
            target: { value: 'Zulu' },
        });

        expect(screen.getByText('Ingen kontakter funnet.')).toBeInTheDocument();
    });

    it('submits selected contact and closes modal', () => {
        const onAddContact = vi.fn();
        const onClose = vi.fn();

        render(
            <ContactModal
                isOpen
                contacts={contacts}
                onClose={onClose}
                onAddContact={onAddContact}
            />
        );

        fireEvent.change(screen.getByLabelText('Filtrer kontakter'), {
            target: { value: 'Alp' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));

        expect(onAddContact).toHaveBeenCalledTimes(1);
        const formData = onAddContact.mock.calls[0][0] as FormData;
        expect(formData.get('contactNin')).toBe('11111111111');
        expect(formData.get('contactName')).toBe('Anna');
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
