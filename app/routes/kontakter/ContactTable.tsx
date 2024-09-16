import React from 'react';
import { Table } from '@navikt/ds-react';
import { GavelSoundBlockIcon, LinkBrokenIcon, ShieldLockIcon } from '@navikt/aksel-icons';
import { IContact, IRole } from '~/types/types';
import RolesSwitch from '~/routes/kontakter/RoleSwitch';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

interface IContactTableProps {
    contactsData?: IContact[];
    rolesData?: IRole[];
    onButtonClick: (formData: FormData) => void;
}

const ContactTable: React.FC<IContactTableProps> = ({ contactsData, rolesData, onButtonClick }) => {
    const hasRole = (currentContact: IContact, roleId: string): boolean => {
        if (currentContact) {
            return currentContact.roles?.includes(roleId + '@' + 'fintlabs_no') ?? false;
        }
        return false;
    };

    const handleUpdateLegalContact = (contactNin: string) => {
        const formData = new FormData();
        formData.append('contactNin', contactNin);
        formData.append('actionType', 'SET_LEGAL_CONTACT');
        onButtonClick(formData);
    };

    const handleRemoveContact = (contactNin: string) => {
        const formData = new FormData();
        formData.append('contactNin', contactNin);
        formData.append('actionType', 'REMOVE_CONTACT');
        onButtonClick(formData);
    };

    function updateRole(contactNin: string, roleId: string, isChecked: boolean) {
        const formData = new FormData();
        formData.append('contactNin', contactNin);
        formData.append('roleId', roleId);

        if (isChecked) formData.append('actionType', 'addRole');
        else formData.append('actionType', 'deleteRole');
        onButtonClick(formData);
    }

    return (
        <>
            <Table zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Admin</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {contactsData?.map((contact, i) => (
                        <Table.ExpandableRow
                            key={i + contact.dn}
                            content={
                                <>
                                    <RolesSwitch
                                        contact={contact}
                                        rolesData={rolesData}
                                        hasRole={hasRole}
                                        updateRole={updateRole}
                                    />

                                    <ConfirmAction
                                        icon={<GavelSoundBlockIcon />}
                                        buttonText={'Gjør til juridisk kontakt'}
                                        titleText={`Bekreft endring til ${contact.firstName} ${contact.lastName}`}
                                        buttonVariant={'primary'}
                                        onConfirm={() => handleUpdateLegalContact(contact.nin)}
                                        subTitleText={
                                            'Er du sikker på at du vil endre til juridisk kontakt?'
                                        }
                                    />

                                    <ConfirmAction
                                        icon={<LinkBrokenIcon />}
                                        buttonText={'Fjern kontakt'}
                                        titleText={`Bekreft fjerning av kontakt ${contact.firstName} ${contact.lastName}`}
                                        buttonVariant={'primary'}
                                        onConfirm={() => handleRemoveContact(contact.nin)}
                                        subTitleText={
                                            'Er du sikker på at du vil fjerne denne kontakten?'
                                        }
                                    />
                                </>
                            }>
                            <Table.DataCell scope="row">
                                {contact.firstName} {contact.lastName}
                            </Table.DataCell>
                            <Table.DataCell>
                                {hasRole(contact, 'ROLE_ADMIN') && (
                                    <ShieldLockIcon title="a11y-title" fontSize="1.5rem" />
                                )}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>

            {/*<ConfirmModal*/}
            {/*    open={modalState.open}*/}
            {/*    onClose={handleCloseModal}*/}
            {/*    onConfirm={handleConfirm}*/}
            {/*    type={modalState.type}*/}
            {/*/>*/}
        </>
    );
};

export default ContactTable;
