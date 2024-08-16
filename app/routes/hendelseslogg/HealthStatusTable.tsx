import React from 'react';
import { Table, BodyShort, Label, Box, VStack, HStack } from '@navikt/ds-react';
import { Log, ReduntantLog } from '~/types/types';

interface HealthStatusProps {
    logs: Log[];
}

const HealthStatusTable: React.FC<HealthStatusProps> = ({ logs }) => {
    return (
        <>
            <>
                <Label>Helsestatus</Label>
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Time</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {logs.map((log, index) => (
                            <Table.Row key={index}>
                                <Table.DataCell>
                                    {log.id}

                                    {log.events.map((event, index) => (
                                        <Box padding={'4'} key={index}>
                                            <VStack>
                                                <HStack>
                                                    <Label>Tid:</Label>
                                                    <BodyShort>{event.timestamp}</BodyShort>
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
                                    ))}
                                </Table.DataCell>
                                <Table.DataCell>{log.action}</Table.DataCell>
                                <Table.DataCell>{log.timestamp}</Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </>
        </>
    );
};

export default HealthStatusTable;
