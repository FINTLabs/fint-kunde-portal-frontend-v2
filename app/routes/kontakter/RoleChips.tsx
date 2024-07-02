import React from 'react';
import { Chips } from '@navikt/ds-react';
import {IContact, IRole} from '~/types/types';

interface IRolesChipsProps {
    contact: IContact;
    rolesData?: IRole[];
    hasRole: (currentContact: IContact, roleId: string) => boolean;
    addRole: (contact:IContact, roleId: string) => void;
}

const RolesChips: React.FC<IRolesChipsProps> = ({ contact, rolesData, hasRole, addRole}) => {
    const isAdmin = hasRole(contact, 'ROLE_ADMIN');

    return (
        <Chips>
            {rolesData?.map((chip, chipIndex) => (
                <Chips.Toggle
                    key={chipIndex + chip.id}
                    selected={hasRole(contact, chip.id) || isAdmin}
                    checkmark={isAdmin && chip.id !== 'ROLE_ADMIN' ? false : undefined}
                    onClick={() => addRole(contact, chip.id)}
                >
                    {chip.name}
                </Chips.Toggle>
            ))}
        </Chips>
    );
};

export default RolesChips;
