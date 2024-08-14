import React from 'react';
import { Table, BodyShort, Label } from '@navikt/ds-react';
import { Log } from '~/types/types';

interface HealthStatusProps {
    logResults: Log[]; // TODO: Replace 'any[]' with the appropriate type for your log results
}

const HealthStatusTable: React.FC<HealthStatusProps> = ({ logResults }) => {
    return (
        <>
            <>
                <Label>Helsestatus</Label>
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Component</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Time</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {logResults.map((log, index) => (
                            <Table.Row key={index}>
                                <Table.DataCell>{log.event.status}</Table.DataCell>
                                <Table.DataCell>{log.event.corrId}</Table.DataCell>
                                <Table.DataCell>{log.event.time}</Table.DataCell>
                                <Table.DataCell>{log.event.action}</Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </>
        </>
    );
};

export default HealthStatusTable;
