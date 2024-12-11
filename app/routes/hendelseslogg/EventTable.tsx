import React from 'react';
import { Table } from '@navikt/ds-react';
import { LogEvent } from '~/types/LogEvent';
import { formatDate } from '~/utils/dateUtils';

interface EventTableProps {
    events: LogEvent[];
}

const EventTable = ({ events }: EventTableProps) => {
    return (
        <Table size="small">
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
