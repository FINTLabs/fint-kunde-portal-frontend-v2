import React from 'react';
import { Chips } from '@navikt/ds-react';
import { IContact, IRole } from '~/api/types';

interface IRolesChipsProps {
    contact: IContact;
    rolesData?: IRole[];
    hasRole: (currentContact: IContact, roleId: string) => boolean;
}

const RolesChips: React.FC<IRolesChipsProps> = ({ contact, rolesData, hasRole }) => {
    const isAdmin = hasRole(contact, 'ROLE_ADMIN');

    return (
        <Chips>
            {rolesData?.map((chip, chipIndex) => (
                <Chips.Toggle
                    key={chipIndex + chip.id}
                    selected={hasRole(contact, chip.id) || isAdmin}
                    checkmark={isAdmin && chip.id !== 'ROLE_ADMIN' ? false : undefined}
                >
                    {chip.name}
                </Chips.Toggle>
            ))}
        </Chips>
    );
};

export default RolesChips;
