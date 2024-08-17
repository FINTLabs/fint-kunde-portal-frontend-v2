import React, { useState } from 'react';
import { Button, Table } from '@navikt/ds-react';
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

const ContactTable: React.FC<IContactTableProps> = ({ contactsData, rolesData }) => {
    const [modalState, setModalState] = useState<{
        type: ModalType;
        contact?: IContact;
        open: boolean;
    }>({ type: 'juridisk', contact: undefined, open: false });
    const fetcher = useFetcher();

    // const userSession = useOutletContext<IUserSession>();
    const hasRole = (currentContact: IContact, roleId: string): boolean => {
        if (currentContact) {
            return currentContact.roles?.includes(roleId + '@' + 'fintlabs_no') ?? false;
        }
        return false;
    };

    const handleOpenModal = (type: ModalType, contact: IContact) => {
        setModalState({ type, contact, open: true });
    };

    const handleCloseModal = () => {
        setModalState({ ...modalState, open: false });
    };

    const handleConfirm = () => {
        // todo: Handle confirm action here
        console.log(`${modalState.type} confirmed for contact:`, modalState.contact);
        const contactNin = (modalState.contact?.nin as string) || '';

        const formData = new FormData();
        formData.append('contactNin', contactNin);

        console.log(modalState);
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
                                    <fetcher.Form method="post">
                                        <RolesSwitch
                                            contact={contact}
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
