import React from 'react';
import { Fieldset, Switch } from '@navikt/ds-react';
import { IContact, IRole } from '~/types/types';

interface IRolesChipsProps {
    contact: IContact;
    rolesData?: IRole[];
    hasRole: (currentContact: IContact, roleId: string) => boolean;
    updateRole: (contactNin: string, roleId: string, isChecked: boolean) => void;
}

const RolesSwitch: React.FC<IRolesChipsProps> = ({ contact, rolesData, hasRole, updateRole }) => {
    const isAdmin = hasRole(contact, 'ROLE_ADMIN');

    const handleSwitchChange = (roleId: string, isChecked: boolean) => {
        updateRole(contact.nin, roleId, isChecked);
    };

    return (
        <Fieldset legend="Roles" className="flex-wrap">
            {rolesData?.map((role, index) => (
                <Switch
                    size="small"
                    key={index + role.id}
                    checked={hasRole(contact, role.id)}
                    onChange={(e) => handleSwitchChange(role.id, e.target.checked)}
                    disabled={isAdmin && role.id !== 'ROLE_ADMIN'}
                    description={role.description}>
                    {role.name}
                </Switch>
            ))}
        </Fieldset>
    );
};

export default RolesSwitch;
