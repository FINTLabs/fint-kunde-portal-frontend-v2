// components/EndpointTable.tsx
import React from 'react';
import { Table } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';

interface EndpointTableProps {
    component: IComponent;
}

const EndpointTable = ({ component }: EndpointTableProps) => {
    return (
        <Table>
            <Table.Body>
                <Table.Row>
                    <Table.DataCell>Produksjon</Table.DataCell>
                    <Table.DataCell>
                        https://api.felleskomponent.no{component.basePath}
                    </Table.DataCell>
                </Table.Row>
                <Table.Row>
                    <Table.DataCell>Beta</Table.DataCell>
                    <Table.DataCell>
                        https://beta.felleskomponent.no{component.basePath}
                    </Table.DataCell>
                </Table.Row>
                <Table.Row>
                    <Table.DataCell>Play-with-FINT</Table.DataCell>
                    <Table.DataCell>
                        https://play-with-fint.felleskomponent.no{component.basePath}
                    </Table.DataCell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
};

export default EndpointTable;
