import React from 'react';
import { HGrid } from '@navikt/ds-react';
import { GavelSoundBlockIcon, LinkBrokenIcon } from '@navikt/aksel-icons';
import { IContact, IRole } from '~/types/types';
import RolesSwitch from '~/routes/kontakter/RoleSwitch';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

interface ExpandableRowContentProps {
    contact: IContact;
    rolesData?: IRole[];
    hasRole: (contact: IContact, roleId: string) => boolean;
    updateRole: (contactNin: string, roleId: string, isChecked: boolean) => void;
    handleUpdateLegalContact: (contactNin: string) => void;
    handleRemoveContact: (contactNin: string) => void;
}

const ExpandableRowContent: React.FC<ExpandableRowContentProps> = ({
    contact,
    rolesData,
    hasRole,
    updateRole,
    handleUpdateLegalContact,
    handleRemoveContact,
}) => {
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
                    onConfirm={() => handleRemoveContact(contact.nin)}
                    subTitleText={`Er du sikker på at du vil fjerne ${contact.firstName} ${contact.lastName} ?`}
                />
            </HGrid>
        </>
    );
};

export default ExpandableRowContent;
