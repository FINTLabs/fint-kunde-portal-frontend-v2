import React from 'react';
import { BodyShort, Fieldset, Switch } from '@navikt/ds-react';
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
        <Fieldset legend="Roller" className="flex-wrap">
            {rolesData?.map((role, index) => {
                const isSwitchDisabled = isAdmin && role.id !== 'ROLE_ADMIN';

                return (
                    <>
                        <Switch
                            size="small"
                            checked={isAdmin || hasRole(contact, role.id)}
                            onChange={(e) => handleSwitchChange(role.id, e.target.checked)}
                            disabled={isSwitchDisabled}>
                            {role.name}
                        </Switch>

                        {role.description.split('...').map((item, key) => (
                            <BodyShort
                                key={key}
                                size="small"
                                className={`pl-5 ${isSwitchDisabled ? 'opacity-30' : ''}`}>
                                {item}
                            </BodyShort>
                        ))}
                    </>
                );
            })}
        </Fieldset>
    );
};

export default RolesSwitch;
