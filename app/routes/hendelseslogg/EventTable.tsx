import React from 'react';
import { Table } from '@navikt/ds-react';
import { LogEvent } from '~/types/LogEvent';

interface EventTableProps {
    events: LogEvent[];
}

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const time = date.toLocaleTimeString('no-NO');
    return `${d}.${m}.${y} ${time}`;
};

const EventTable: React.FC<EventTableProps> = ({ events }) => {
    return (
        <Table size="small">
            {/*<Table.Header>*/}
            {/*    <Table.Row>*/}
            {/*        <Table.HeaderCell scope="col">Tid</Table.HeaderCell>*/}
            {/*        <Table.HeaderCell scope="col">Klient</Table.HeaderCell>*/}
            {/*        <Table.HeaderCell scope="col">Status</Table.HeaderCell>*/}
            {/*        <Table.HeaderCell scope="col">Response</Table.HeaderCell>*/}
            {/*        <Table.HeaderCell scope="col">Melding</Table.HeaderCell>*/}
            {/*    </Table.Row>*/}
            {/*</Table.Header>*/}
            <Table.Body>
                {events.map((event, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>{formatDate(event.timestamp)}</Table.DataCell>
                        <Table.DataCell>{event.klient}</Table.DataCell>
                        <Table.DataCell>{event.status}</Table.DataCell>
                        <Table.DataCell>{event.response}</Table.DataCell>
                        <Table.DataCell>{event.melding}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default EventTable;
