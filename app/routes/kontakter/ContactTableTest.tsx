import React, { useState } from 'react';
import { Button, Table, Box, HGrid, Heading } from '@navikt/ds-react';
import { GavelSoundBlockIcon, LinkBrokenIcon, ShieldLockIcon } from '@navikt/aksel-icons';
import { IContact, IRole } from '~/types/types';
import ConfirmModal from './ConfirmModal';
import { useFetcher } from '@remix-run/react';
import RolesSwitch from '~/routes/kontakter/RoleSwitch';

interface IContactTableProps {
    contactsData?: IContact[];
    rolesData?: IRole[];
}

type ModalType = 'fjern' | 'juridisk';

const ContactTableTest: React.FC<IContactTableProps> = ({ contactsData, rolesData }) => {
    const [selectedContact, setSelectedContact] = useState<IContact | undefined>();
    const [modalState, setModalState] = useState<{
        type: ModalType;
        contact?: IContact;
        open: boolean;
    }>({ type: 'juridisk', contact: undefined, open: false });
    const fetcher = useFetcher();

    const hasRole = (currentContact: IContact, roleId: string): boolean => {
        return currentContact?.roles?.includes(roleId + '@' + 'fintlabs_no') ?? false;
    };

    const handleOpenModal = (type: ModalType, contact: IContact) => {
        setModalState({ type, contact, open: true });
    };

    const handleCloseModal = () => {
        setModalState({ ...modalState, open: false });
    };

    const handleConfirm = () => {
        const contactNin = (modalState.contact?.nin as string) || '';

        const formData = new FormData();
        formData.append('contactNin', contactNin);
        formData.append(
            'actionType',
            modalState.type === 'fjern' ? 'removeTechnicalContact' : 'setLegalContact'
        );

        fetcher.submit(formData, {
            method: 'POST',
            navigate: false,
        });
        handleCloseModal();
    };

    function updateRole(contactNin: string, roleId: string, isChecked: boolean) {
        const formData = new FormData();
        formData.append('contactNin', contactNin);
        formData.append('roleId', roleId);

        if (isChecked) formData.append('actionType', 'addRole');
        else formData.append('actionType', 'deleteRole');

        fetcher.submit(formData, {
            method: 'post',
            action: '/kontakter',
        });
    }

    return (
        <HGrid gap="6" columns={2}>
            {/* Left side: Scrollable contact list */}
            <Box style={{ maxHeight: '500px', overflowY: 'auto' }}>
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
                            <Table.Row
                                key={i + contact.dn}
                                onClick={() => setSelectedContact(contact)}
                                className={selectedContact?.dn === contact.dn ? 'bg-blue-100' : ''}>
                                <Table.DataCell scope="row">
                                    {contact.firstName} {contact.lastName}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {hasRole(contact, 'ROLE_ADMIN') && (
                                        <ShieldLockIcon title="Admin" fontSize="1.5rem" />
                                    )}
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Box>

            {/* Right side: Contact details */}
            <Box>
                <Heading size={'medium'}>{selectedContact?.firstName}</Heading>
                {selectedContact ? (
                    <Box>
                        <fetcher.Form method="post">
                            <RolesSwitch
                                contact={selectedContact}
                                rolesData={rolesData}
                                hasRole={hasRole}
                                updateRole={updateRole}
                            />
                        </fetcher.Form>
                        <Button
                            icon={<GavelSoundBlockIcon />}
                            variant="tertiary"
                            size="small"
                            className={'!mt-10'}
                            onClick={() => handleOpenModal('juridisk', selectedContact)}>
                            Gjør til juridisk kontakt
                        </Button>
                        <Button
                            icon={<LinkBrokenIcon />}
                            variant="tertiary"
                            size="small"
                            onClick={() => handleOpenModal('fjern', selectedContact)}>
                            Fjern kontakt
                        </Button>
                    </Box>
                ) : (
                    <p>Velg en kontakt for å se detaljer</p>
                )}
            </Box>

            <ConfirmModal
                open={modalState.open}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                type={modalState.type}
            />
        </HGrid>
    );
};

export default ContactTableTest;
