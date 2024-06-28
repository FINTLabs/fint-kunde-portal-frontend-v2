// ContactTable.tsx
import React, { useState } from 'react';
import { Table, Button } from '@navikt/ds-react';
import { GavelSoundBlockIcon, LinkBrokenIcon, ShieldLockIcon } from '@navikt/aksel-icons';
import { IContact, IRole } from '~/api/types';
import ConfirmModal from './ConfirmModal';
import RolesChips from "~/routes/kontakter/RoleChips";

interface IContactTableProps {
    contactsData?: IContact[];
    rolesData?: IRole[];
    hasRole: (currentContact: IContact, roleId: string) => boolean;
}

const ContactTable: React.FC<IContactTableProps> = ({ contactsData, rolesData, hasRole }) => {
    const [modalState, setModalState] = useState<{ type: string, contact?: IContact, open: boolean }>({ type: '', contact: undefined, open: false });

    const handleOpenModal = (type: string, contact: IContact) => {
        setModalState({ type, contact, open: true });
    };

    const handleCloseModal = () => {
        setModalState({ ...modalState, open: false });
    };

    const handleConfirm = () => {
        // Handle confirm action here
        console.log(`${modalState.type} confirmed for contact:`, modalState.contact);
        handleCloseModal();
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
                                    />

                                    <Button
                                        icon={<GavelSoundBlockIcon />}
                                        variant="tertiary"
                                        size="small"
                                        className={"!mt-10"}
                                        onClick={() => handleOpenModal('juridisk', contact)}
                                    >
                                        Gjør til juridisk kontakt
                                    </Button>
                                    <Button
                                        icon={<LinkBrokenIcon />}
                                        variant="tertiary"
                                        size="small"
                                        onClick={() => handleOpenModal('fjern', contact)}
                                    >
                                        Fjern kontakt
                                    </Button>
                                </>
                            }
                        >
                            <Table.DataCell scope="row">{contact.firstName} {contact.lastName}</Table.DataCell>
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
