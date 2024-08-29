import React from 'react';
import { Table, BodyShort, Label, Box, VStack, HStack, Accordion } from '@navikt/ds-react';
import { Log, ReduntantLog } from '~/types/types';

interface HealthStatusProps {
    logs: Log[];
}

function formattedDate(event: { timestamp: number | Date | undefined }): string {
    return new Intl.DateTimeFormat('en-NO', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23',
    }).format(event.timestamp);
}

const HealthStatusTable: React.FC<HealthStatusProps> = ({ logs }) => {
    return (
        <>
            <Label>Helsestatus</Label>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Time</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Action</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Response</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {logs.map((log, index) => (
                        <Table.ExpandableRow
                            key={log.id || index}
                            content={log.events.map((event, eventIndex) => (
                                <Box padding={'4'} key={event.id || eventIndex}>
                                    <VStack>
                                        <HStack>
                                            <Label>Tid:</Label>
                                            <BodyShort>{formattedDate(event.timestamp)}</BodyShort>
                                        </HStack>
                                        <HStack>
                                            <Label>Klient:</Label>
                                            <BodyShort>{event.klient}</BodyShort>
                                        </HStack>
                                        <HStack>
                                            <Label>Status:</Label>
                                            <BodyShort>{event.status}</BodyShort>
                                        </HStack>
                                        <HStack>
                                            <Label>Response:</Label>
                                            <BodyShort>{event.response}</BodyShort>
                                        </HStack>
                                        <HStack>
                                            <Label>Melding:</Label>
                                            <BodyShort>{event.melding}</BodyShort>
                                        </HStack>
                                    </VStack>
                                </Box>
                            ))}>
                            <Table.Row>
                                <Table.DataCell>{log.id}</Table.DataCell>
                                <Table.DataCell>{formattedDate(log.timestamp)}</Table.DataCell>
                                <Table.DataCell>{log.action}</Table.DataCell>
                                <Table.DataCell>{log.response}</Table.DataCell>
                            </Table.Row>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
};

export default HealthStatusTable;
