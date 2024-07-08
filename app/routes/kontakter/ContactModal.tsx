// ContactModal.tsx
import React, { useState } from 'react';
import { Button, Modal, Pagination, Table, TextField } from '@navikt/ds-react';
import { IContact } from '~/types/types';
import { PersonPlusIcon } from '@navikt/aksel-icons';
import { log } from '~/utils/logger';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    contacts: IContact[];
    f: any; //TODO fix this type
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contacts, f }) => {
    const [filter, setFilter] = useState<string>('');
    const [selectedContactNin, setSelectedContactNin] = useState<string>('');

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.firstName.toLowerCase().includes(filter.toLowerCase()) ||
            contact.lastName.toLowerCase().includes(filter.toLowerCase())
    );

    const [page, setPage] = useState(1);
    const rowsPerPage = 4;

    let sortData = filteredContacts;
    sortData = sortData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFilter(e.target.value);
        setPage(1);
    }

    function handleClose() {
        setPage(1);
        setFilter('');
        onClose();
    }

    function handleSetSelectedContact(nin: string) {
        log('Selected Contact:', nin);
        //TODO: figure this out

        // const formData = new FormData();
        // formData.append('selectedContactNin', nin);
        // f.submit(formData, { method: 'post' });
        // f.submit({ method: 'POST' }, { selectedContactNin: nin });
        setSelectedContactNin(nin);
        f.submit();
        // handleClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-heading"
            width={'small'}
            // size={'medium'}
            header={{
                label: 'Kontakter',
                heading: 'Legg til ny',
            }}>
            <Modal.Body>
                <TextField
                    label="Filter Contacts"
                    placeholder="Type to filter by name"
                    value={filter}
                    onChange={handleFilterChange}
                />
                <f.Form method="POST">
                    <input type={'hidden'} name={'selectedContactNin'} value={selectedContactNin} />
                    <Table>
                        <Table.Body>
                            {sortData.map((contact) => (
                                <Table.Row key={contact.dn}>
                                    <Table.DataCell>
                                        {contact.firstName} {contact.lastName}
                                    </Table.DataCell>
                                    <Table.DataCell width={'1'}>
                                        <Button
                                            icon={<PersonPlusIcon title="Rediger" />}
                                            size="xsmall"
                                            onClick={() => {
                                                handleSetSelectedContact(contact.nin);
                                            }}
                                        />
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </f.Form>
                <Pagination
                    page={page}
                    onPageChange={setPage}
                    count={Math.ceil(filteredContacts.length / rowsPerPage)}
                    size="small"
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} size="xsmall">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ContactModal;
