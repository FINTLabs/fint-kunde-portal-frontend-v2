import { GavelSoundBlockIcon, LinkBrokenIcon } from '@navikt/aksel-icons';
import { HGrid } from '@navikt/ds-react';
import React from 'react';

import ConfirmAction from '~/components/shared/ConfirmActionModal';
import RolesSwitch from '~/routes/kontakter/RoleSwitch';
import { IContact } from '~/types/Contact';
import { IRole } from '~/types/Role';

interface ExpandableRowContentProps {
    contact: IContact;
    rolesData?: IRole[];
    hasRole: (contact: IContact, roleId: string) => boolean;
    updateRole: (formData: FormData) => void;
    handleUpdateLegalContact: (contactNin: string) => void;
    handleRemoveContact: (formData: FormData) => void;
}

const ExpandableRowContent = ({
    contact,
    rolesData,
    hasRole,
    updateRole,
    handleUpdateLegalContact,
    handleRemoveContact,
}: ExpandableRowContentProps) => {
    function onRemoveContact() {
        const formData = new FormData();
        formData.append('contactNin', contact.nin);
        formData.append('contactNAme', `${contact.firstName} ${contact.lastName}`);
        handleRemoveContact(formData);
    }

    return (
        <>
            <RolesSwitch
                contact={contact}
                rolesData={rolesData}
                hasRole={hasRole}
                updateRole={updateRole}
            />
            <HGrid columns={3} gap={'5'} className={'pt-5'}>
                <ConfirmAction
                    icon={<GavelSoundBlockIcon />}
                    buttonText={'Sett som juridisk kontakt'}
                    buttonVariant={'primary'}
                    onConfirm={() => handleUpdateLegalContact(contact.nin)}
                    subTitleText={`Er du sikker på at du vil endre ${contact.firstName} ${contact.lastName} til juridisk kontakt?`}
                />

                <ConfirmAction
                    icon={<LinkBrokenIcon />}
                    buttonText={'Fjern kontakt'}
                    buttonVariant={'primary'}
                    onConfirm={onRemoveContact}
                    subTitleText={`Er du sikker på at du vil fjerne ${contact.firstName} ${contact.lastName} ?`}
                />
            </HGrid>
        </>
    );
};

export default ExpandableRowContent;
