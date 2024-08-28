import React from 'react';
import { Table } from '@navikt/ds-react';
import { IAccess } from '~/types/Access';
import { TableHeaderCell } from '@navikt/ds-react/Table';
import { ChevronRightIcon } from '@navikt/aksel-icons';

interface AccessTemplateTableProps {
    data: IAccess[];
    onSelectTemplate: (template: IAccess) => void;
}

const AccessTemplateTable: React.FC<AccessTemplateTableProps> = ({ data, onSelectTemplate }) => {
    const handleRowClick = (template: IAccess) => {
        onSelectTemplate(template);
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Name</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Description</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Collection</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Read</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Modify</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Clients</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Components</Table.HeaderCell>
                    <TableHeaderCell />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((template, i) => (
                    <Table.Row
                        key={i + template.name}
                        onClick={() => handleRowClick(template)}
                        style={{ cursor: 'pointer' }}>
                        <Table.HeaderCell scope="row">{template.name}</Table.HeaderCell>
                        <Table.DataCell>{template.description}</Table.DataCell>
                        <Table.DataCell>{template.collection.length}</Table.DataCell>
                        <Table.DataCell>{template.read.length}</Table.DataCell>
                        <Table.DataCell>{template.modify.length}</Table.DataCell>
                        <Table.DataCell>{template.clients.length}</Table.DataCell>
                        <Table.DataCell>{template.components.length}</Table.DataCell>
                        <Table.DataCell>
                            <ChevronRightIcon title="Details" fontSize="1.7rem" />
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default AccessTemplateTable;
