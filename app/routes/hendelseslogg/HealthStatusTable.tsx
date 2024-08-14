import React from 'react';
import { Table, BodyShort, Label } from '@navikt/ds-react';
import { Log } from '~/types/types';

interface HealthStatusProps {
    logResults: Log[]; // TODO: Replace 'any[]' with the appropriate type for your log results
}

type Grouped = {
    [key: string]: Log[];
};

const HealthStatusTable: React.FC<HealthStatusProps> = ({ logResults }) => {
    const groupById = logResults.reduce(
        (acc, curr) => {
            const key = curr.event.corrId;
            const currentList = acc[key];

            acc[key] = !currentList ? [curr] : [...currentList, curr];

            return acc;
        },
        {} as { [key: string]: Log[] }
    );

    const groupKeys = Object.keys(groupById);

    return (
        <>
            <>
                <Label>Helsestatus</Label>
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                            {/* <Table.HeaderCell scope="col">ID</Table.HeaderCell> */}
                            {/* <Table.HeaderCell scope="col">Time</Table.HeaderCell> */}
                            {/* <Table.HeaderCell scope="col">Type</Table.HeaderCell> */}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {groupKeys.map((key, index) => {
                            const logs = groupById[key];
                            console.log(logs);
                            return (
                                <Table.Row key={index}>
                                    <Table.DataCell>{key}</Table.DataCell>
                                    <Table.DataCell>{logs[0].event.action}</Table.DataCell>
                                    {/* <Table.DataCell>{log.status}</Table.DataCell>
                                    <Table.DataCell>{log.event.time}</Table.DataCell>
                                    <Table.DataCell>{log.event.action}</Table.DataCell> */}
                                </Table.Row>
                            );
                        })}
                        {/* {logResults.map((log, index) => (
                            <Table.Row key={index}>
                                <Table.DataCell>{log.event.status}</Table.DataCell>
                                <Table.DataCell>{log.event.corrId}</Table.DataCell>
                                <Table.DataCell>{log.event.time}</Table.DataCell>
                                <Table.DataCell>{log.event.action}</Table.DataCell>
                            </Table.Row>
                        ))} */}
                    </Table.Body>
                </Table>
            </>
        </>
    );
};

export default HealthStatusTable;
