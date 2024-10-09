import React from 'react';
import { Table } from '@navikt/ds-react';
import { IContact, IRole } from '~/types/types';
import RoleTags from './RoleTags';
import ExpandableRowContent from './ExpandableRowContent';

interface IContactTableProps {
    contactsData?: IContact[];
    rolesData?: IRole[];
    onButtonClick: (formData: FormData) => void;
    selectedOrg: string;
}

const ContactTable: React.FC<IContactTableProps> = ({
    contactsData,
    rolesData,
    onButtonClick,
    selectedOrg,
}) => {
    const hasRole = (currentContact: IContact, roleId: string): boolean => {
        return currentContact?.roles?.includes(roleId + '@' + selectedOrg) ?? false;
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

    const updateRole = (contactNin: string, roleId: string, isChecked: boolean) => {
        const formData = new FormData();
        formData.append('contactNin', contactNin);
        formData.append('roleId', roleId);

        if (isChecked) formData.append('actionType', 'ADD_ROLE');
        else formData.append('actionType', 'DELETE_ROLE');
        onButtonClick(formData);
    };

    const getUserRolesForOrg = (contact: IContact): string[] => {
        return (
            contact.roles
                ?.filter((role) => role.endsWith(`@${selectedOrg}`))
                .map((role) => role.split('@')[0]) ?? []
        );
    };

    return (
        <Table zebraStripes>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Roller</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {contactsData?.map((contact, i) => (
                    <Table.ExpandableRow
                        key={i + contact.dn}
                        content={
                            <ExpandableRowContent
                                contact={contact}
                                rolesData={rolesData}
                                hasRole={hasRole}
                                updateRole={updateRole}
                                handleUpdateLegalContact={handleUpdateLegalContact}
                                handleRemoveContact={handleRemoveContact}
                            />
                        }>
                        <Table.DataCell scope="row">
                            {contact.firstName} {contact.lastName}
                        </Table.DataCell>
                        <Table.DataCell>
                            {/* Render the RoleTags component */}
                            <RoleTags
                                contact={contact}
                                hasRole={hasRole}
                                getUserRolesForOrg={getUserRolesForOrg}
                            />
                        </Table.DataCell>
                    </Table.ExpandableRow>
                ))}
            </Table.Body>
        </Table>
    );
};

export default ContactTable;
