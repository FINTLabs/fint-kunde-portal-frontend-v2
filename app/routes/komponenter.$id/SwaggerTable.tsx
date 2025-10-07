// components/EndpointTable.tsx
import { Table } from '@navikt/ds-react';
import React from 'react';

import { IComponent } from '~/types/Component';

interface EndpointTableProps {
    component: IComponent;
}

const SwaggerTable = ({ component }: EndpointTableProps) => {
    return (
        <Table>
            <Table.Body>
                <Table.Row>
                    <Table.DataCell>Produksjon</Table.DataCell>
                    <Table.DataCell>
                        https://api.felleskomponent.no{component.basePath}
                        /swagger-ui.html
                    </Table.DataCell>
                </Table.Row>
                <Table.Row>
                    <Table.DataCell>Beta</Table.DataCell>
                    <Table.DataCell>
                        https://beta.felleskomponent.no{component.basePath}
                        /swagger-ui.html
                    </Table.DataCell>
                </Table.Row>
                <Table.Row>
                    <Table.DataCell>Play-with-FINT</Table.DataCell>
                    <Table.DataCell>
                        https://play-with-fint.felleskomponent.no
                        {component.basePath}
                        /swagger-ui.html
                    </Table.DataCell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
};

export default SwaggerTable;
