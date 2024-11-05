import React, { useState } from 'react';
import { Button, Modal, Pagination, Table, TextField } from '@navikt/ds-react';
import { PersonPlusIcon } from '@navikt/aksel-icons';
import { IContact } from '~/types/Contact';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    contacts: IContact[];
    onAddContact: (formData: FormData) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contacts, onAddContact }) => {
    const [filter, setFilter] = useState<string>('');
    // const [selectedContactNin, setSelectedContactNin] = useState<string>('');
    // const fetcher = useFetcher();

    const filteredContacts = filter
        ? contacts.filter(
              (contact) =>
                  contact.firstName.toLowerCase().startsWith(filter.toLowerCase()) ||
                  contact.lastName.toLowerCase().startsWith(filter.toLowerCase())
          )
        : [];

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

    function handleSetSelectedContact(nin: string, firstName: string) {
        const formData = new FormData();
        formData.append('contactNin', nin);
        formData.append('contactName', firstName);
        onAddContact(formData);
        handleClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-heading"
            width={'small'}
            header={{
                label: 'Kontakter',
                heading: 'Legg til ny',
            }}>
            <Modal.Body>
                <TextField
                    label="Filtrer kontakter"
                    placeholder="Skriv for å filtrere etter navn"
                    value={filter}
                    onChange={handleFilterChange}
                />

                {/* Set a fixed height for the table wrapper */}
                <div style={{ minHeight: '200px' }}>
                    <Table>
                        <Table.Body>
                            {sortData.length === 0 && filter !== '' ? (
                                <Table.Row>
                                    <Table.DataCell colSpan={2}>
                                        Ingen kontakter funnet.
                                    </Table.DataCell>
                                </Table.Row>
                            ) : (
                                sortData.map((contact) => (
                                    <Table.Row key={contact.dn}>
                                        <Table.DataCell>
                                            {contact.firstName} {contact.lastName}
                                        </Table.DataCell>
                                        <Table.DataCell width={'1'}>
                                            <Button
                                                icon={<PersonPlusIcon title="Rediger" />}
                                                size="xsmall"
                                                onClick={() => {
                                                    handleSetSelectedContact(
                                                        contact.nin,
                                                        contact.firstName
                                                    );
                                                }}
                                            />
                                        </Table.DataCell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table>
                </div>
                {filteredContacts.length > 0 && (
                    <Pagination
                        page={page}
                        onPageChange={setPage}
                        count={Math.ceil(filteredContacts.length / rowsPerPage)}
                        size="small"
                    />
                )}
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
