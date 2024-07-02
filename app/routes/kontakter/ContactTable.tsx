import React, { useState } from 'react';
import { Table, Button } from '@navikt/ds-react';
import { GavelSoundBlockIcon, LinkBrokenIcon, ShieldLockIcon } from '@navikt/aksel-icons';
import { IContact, IRole, type UserSession } from '~/types/types';
import ConfirmModal from './ConfirmModal';
import RolesChips from '~/routes/kontakter/RoleChips';
import { log } from '~/utils/logger';
import { useOutletContext } from '@remix-run/react';

interface IContactTableProps {
    contactsData?: IContact[];
    rolesData?: IRole[];
}

const ContactTable: React.FC<IContactTableProps> = ({ contactsData, rolesData }) => {
    const [modalState, setModalState] = useState<{
        type: string;
        contact?: IContact;
        open: boolean;
    }>({ type: '', contact: undefined, open: false });

    const userSession = useOutletContext<UserSession>();

    const hasRole = (currentContact: IContact, roleId: string): boolean => {
        if (currentContact) {
            return currentContact.roles?.includes(roleId + '@' + 'fintlabs_no') ?? false;
        }
        return false;
    };

    const handleOpenModal = (type: string, contact: IContact) => {
        setModalState({ type, contact, open: true });
    };

    const handleCloseModal = () => {
        setModalState({ ...modalState, open: false });
    };

    const handleConfirm = () => {
        // todo: Handle confirm action here
        console.log(`${modalState.type} confirmed for contact:`, modalState.contact);
        handleCloseModal();
    };
    const addRole = (contact: IContact, roleId: string) => {
        // RoleApi.addRole(orgName, contactNin, roleId);
        log(
            `Role ${roleId} added to contact ${contact.nin} with org: ${userSession.selectedOrganization?.name}`
        );
        log('Contact:', contact);
        log(hasRole(contact, roleId));
    };

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
                                    <RolesChips
                                        contact={contact}
                                        rolesData={rolesData}
                                        hasRole={hasRole}
                                        addRole={addRole}
                                    />

                                    <Button
                                        icon={<GavelSoundBlockIcon />}
                                        variant="tertiary"
                                        size="small"
                                        className={'!mt-10'}
                                        onClick={() => handleOpenModal('juridisk', contact)}>
                                        Gjør til juridisk kontakt
                                    </Button>
                                    <Button
                                        icon={<LinkBrokenIcon />}
                                        variant="tertiary"
                                        size="small"
                                        onClick={() => handleOpenModal('fjern', contact)}>
                                        Fjern kontakt
                                    </Button>
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

            <ConfirmModal
                open={modalState.open}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                type={modalState.type}
            />
        </>
    );
};

export default ContactTable;
