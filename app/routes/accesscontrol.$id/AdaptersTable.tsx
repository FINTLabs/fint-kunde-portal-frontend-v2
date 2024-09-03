import React from 'react';
import { Table } from '@navikt/ds-react';

interface ComponentAdaptersTableProps {
    adapters: string[];
}

const ComponentAdaptersTable: React.FC<ComponentAdaptersTableProps> = ({ adapters }) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Adapter Name</Table.HeaderCell>
                    <Table.HeaderCell>Details</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {adapters.map((adapter, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>{adapter}</Table.DataCell>
                        <Table.DataCell>abc</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default ComponentAdaptersTable;
