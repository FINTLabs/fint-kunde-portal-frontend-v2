import React from 'react';
import { Label, Table } from '@navikt/ds-react';
import EventTable from '~/routes/hendelseslogg/EventTable';
import { CheckmarkCircleIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Log } from '~/types/LogEvent';

interface HealthStatusProps {
    logs: Log[];
}

function formattedDate(timestamp: number | Date | undefined): string {
    return new Intl.DateTimeFormat('en-NO', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23',
    }).format(timestamp);
}

const LogTable = ({ logs }: HealthStatusProps) => {
    return (
        <>
            <Label>Helsestatus</Label>
            <Table size="medium">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                        <Table.HeaderCell scope="col">Hendelsesid</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Tid</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Hendelse</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {logs.map((log, index) => {
                        const hasError = log.events.some((event) => event.response === 'ERROR');
                        //
                        // const lastEventResponse =
                        //     log.events.length > 0
                        //         ? log.events[log.events.length - 1].status +
                        //           log.events[log.events.length - 1].response
                        //         : 'NO STATUS';

                        return (
                            <Table.ExpandableRow
                                key={log.id || index}
                                content={<EventTable events={log.events} />}>
                                <Table.DataCell scope="row">{log.id}</Table.DataCell>
                                <Table.DataCell>{formattedDate(log.timestamp)}</Table.DataCell>
                                <Table.DataCell>{log.action}</Table.DataCell>
                                <Table.DataCell>
                                    {hasError ? (
                                        <ExclamationmarkTriangleIcon
                                            style={{ color: 'red', marginRight: '0.5rem' }}
                                        />
                                    ) : (
                                        <CheckmarkCircleIcon
                                            title="CheckmarkCircleIcon"
                                            fontSize="1.5rem"
                                            style={{ color: 'green', marginRight: '0.5rem' }}
                                        />
                                    )}
                                </Table.DataCell>
                            </Table.ExpandableRow>
                        );
                    })}
                </Table.Body>
            </Table>
        </>
    );
};

export default LogTable;
