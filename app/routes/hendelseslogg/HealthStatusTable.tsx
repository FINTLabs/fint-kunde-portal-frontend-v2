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
            <Accordion size="small">
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
                            <Accordion.Item key={index}>
                                <Accordion.Header>
                                    {/* <Table.Row key={index}> */}
                                    {/* <Table.DataCell> */}

                                    <Table.DataCell>
                                        <VStack>{log.id}</VStack>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <VStack>{formattedDate(log.timestamp)}</VStack>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <VStack>{log.action}</VStack>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <VStack>{log.response}</VStack>
                                    </Table.DataCell>
                                </Accordion.Header>

                                {log.events.map((event, index) => (
                                    <Accordion.Content key={index}>
                                        <Box padding={'4'} key={index}>
                                            <VStack>
                                                <HStack>
                                                    <Label>Tid:</Label>
                                                    <BodyShort>
                                                        {formattedDate(event.timestamp)}
                                                    </BodyShort>
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
                                                    <Label>Reponse:</Label>
                                                    <BodyShort>{event.response}</BodyShort>
                                                </HStack>
                                                <HStack>
                                                    <Label>Melding:</Label>
                                                    <BodyShort>{event.melding}</BodyShort>
                                                </HStack>
                                            </VStack>
                                        </Box>
                                    </Accordion.Content>
                                ))}
                                {/* </Table.DataCell> */}

                                {/* </Table.Row> */}
                            </Accordion.Item>
                        ))}
                    </Table.Body>
                </Table>
            </Accordion>
        </>
    );
};

export default HealthStatusTable;
