import React from 'react';
import { Fieldset, Switch } from '@navikt/ds-react';
import { IContact, IRole } from '~/types/types';

interface IRolesChipsProps {
    contact: IContact;
    rolesData?: IRole[];
    hasRole: (currentContact: IContact, roleId: string) => boolean;
    addRole: (contact: IContact, roleId: string) => void;
}

const RolesCheckbox: React.FC<IRolesChipsProps> = ({ contact, rolesData, hasRole, addRole }) => {
    const isAdmin = hasRole(contact, 'ROLE_ADMIN');

    const handleCheckboxChange = (roleId: string) => {
        addRole(contact, roleId);
    };

    return (
        <Fieldset legend="Roles" className={'flex-wrap '}>
            {rolesData?.map((role, index) => (
                <Switch
                    key={index + role.id}
                    checked={hasRole(contact, role.id)}
                    onChange={() => handleCheckboxChange(role.id)}
                    disabled={isAdmin && role.id !== 'ROLE_ADMIN'}
                    description={role.description}>
                    {role.name}
                </Switch>
            ))}
        </Fieldset>
    );
};

export default RolesCheckbox;
