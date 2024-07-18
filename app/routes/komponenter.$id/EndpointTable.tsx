// components/EndpointTable.tsx
import React from 'react';
import { Table } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';

interface ComponentTableProps {
    component: IComponent;
}

const EndpointTable: React.FC<ComponentTableProps> = ({ component }) => {
    return (
        <Table>
            <Table.Row>
                <Table.DataCell>Produksjon</Table.DataCell>
                <Table.DataCell>https://api.felleskomponent.no{component.basePath}</Table.DataCell>
            </Table.Row>
            <Table.Row>
                <Table.DataCell>Beta</Table.DataCell>
                <Table.DataCell>https://beta.felleskomponent.no{component.basePath}</Table.DataCell>
            </Table.Row>
            <Table.Row>
                <Table.DataCell>Play-with-FINT</Table.DataCell>
                <Table.DataCell>
                    https://play-with-fint.felleskomponent.no{component.basePath}
                </Table.DataCell>
            </Table.Row>
        </Table>
    );
};

export default EndpointTable;
