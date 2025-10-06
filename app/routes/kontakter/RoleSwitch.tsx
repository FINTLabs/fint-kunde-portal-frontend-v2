import { BodyShort, Fieldset, Switch } from '@navikt/ds-react';
import React from 'react';

import { IContact } from '~/types/Contact';
import { IRole } from '~/types/Role';

interface IRolesChipsProps {
    contact: IContact;
    rolesData?: IRole[];
    hasRole: (currentContact: IContact, roleId: string) => boolean;
    updateRole: (formData: FormData) => void;
}

const RolesSwitch = ({ contact, rolesData, hasRole, updateRole }: IRolesChipsProps) => {
    const isAdmin = hasRole(contact, 'ROLE_ADMIN');

    const handleSwitchChange = (roleId: string, isChecked: boolean, roleName: string) => {
        const formData = new FormData();
        formData.append('contactNin', contact.nin);
        formData.append('roleId', roleId);
        formData.append('isChecked', isChecked ? 'true' : 'false');
        formData.append('contactName', `${contact.firstName} ${contact.lastName}`);
        formData.append('roleName', roleName);
        updateRole(formData);
    };

    return (
        <Fieldset legend="Roller" className="flex-wrap">
            {rolesData?.map((role) => {
                const isSwitchDisabled = isAdmin && role.id !== 'ROLE_ADMIN';

                return (
                    <React.Fragment key={role.id}>
                        <Switch
                            size="small"
                            checked={isAdmin || hasRole(contact, role.id)}
                            onChange={(e) =>
                                handleSwitchChange(role.id, e.target.checked, role.name)
                            }
                            disabled={isSwitchDisabled}>
                            {role.name}
                        </Switch>

                        {role.description.split('...').map((item, key) => (
                            <BodyShort
                                key={`${role.id}_description_${key}`}
                                size="small"
                                className={`pl-5 ${isSwitchDisabled ? 'opacity-30' : ''}`}>
                                {item}
                            </BodyShort>
                        ))}
                    </React.Fragment>
                );
            })}
        </Fieldset>
    );
};

export default RolesSwitch;
