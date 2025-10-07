import { Table } from '@navikt/ds-react';
import React from 'react';

import { IContact } from '~/types/Contact';
import { IRole } from '~/types/Role';

import ExpandableRowContent from './ExpandableRowContent';
import RoleTags from './RoleTags';

interface IContactTableProps {
    contactsData?: IContact[];
    rolesData?: IRole[];
    onButtonClick: (formData: FormData) => void;
    selectedOrg: string;
}

const ContactTable = ({
    contactsData,
    rolesData,
    onButtonClick,
    selectedOrg,
}: IContactTableProps) => {
    const hasRole = (currentContact: IContact, roleId: string): boolean => {
        return currentContact?.roles?.includes(roleId + '@' + selectedOrg) ?? false;
    };

    const handleUpdateLegalContact = (contactNin: string) => {
        const formData = new FormData();
        formData.append('contactNin', contactNin);
        formData.append('actionType', 'SET_LEGAL_CONTACT');
        onButtonClick(formData);
    };

    const handleRemoveContact = (formData: FormData) => {
        // const formData = new FormData();
        formData.append('actionType', 'REMOVE_CONTACT');
        onButtonClick(formData);
    };

    const updateRole = (formData: FormData) => {
        // const formData = new FormData();
        // formData.append('contactNin', contactNin);
        // formData.append('contactName', contactName);
        // formData.append('roleId', roleId);

        if (formData.get('isChecked') === 'true') formData.append('actionType', 'ADD_ROLE');
        else formData.append('actionType', 'DELETE_ROLE');
        onButtonClick(formData);
    };

    const getUserRolesForOrg = (contact: IContact): string[] => {
        return (
            contact.roles
                ?.filter((role) => role.endsWith(`@${selectedOrg}`))
                .map((role) => {
                    const roleName = role.split('@')[0];
                    const matchedRole = rolesData?.find((r) => r.id === roleName);
                    return matchedRole ? matchedRole.name : roleName;
                }) ?? []
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
