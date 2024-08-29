import React from 'react';
import { Table, BodyShort, Label, VStack, HStack } from '@navikt/ds-react';
import { Log } from '~/types/types';

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

interface ApiResponse {
    status: string;
    response?: string;
}

const HealthStatusView: React.FC<HealthStatusProps> = ({ logs }) => {
    return (
        <>
            <Label>Helsestatus</Label>
            <Table size="medium">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                        <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Tid</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Action</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Response</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {logs.map((log, index) => {
                        // Get the last event's response if it exists
                        const lastEventResponse =
                            log.events.length > 0
                                ? log.events[log.events.length - 1].response
                                : 'No response'; // Default text if there are no events

                        return (
                            <Table.ExpandableRow
                                key={log.id || index}
                                content={
                                    <VStack>
                                        {log.events.map((event, eventIndex) => {
                                            const isLast = eventIndex === log.events.length - 1;
                                            const CellComponent = isLast ? VStack : Table.DataCell;

                                            return (
                                                <CellComponent
                                                    className="my-4 mx-1"
                                                    key={event.id || eventIndex}>
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
                                                        <Label>Response:</Label>
                                                        <BodyShort>{event.response}</BodyShort>
                                                    </HStack>
                                                </CellComponent>
                                            );
                                        })}
                                    </VStack>
                                }>
                                <Table.DataCell scope="row">{log.id}</Table.DataCell>
                                <Table.DataCell>{formattedDate(log.timestamp)}</Table.DataCell>
                                <Table.DataCell>{log.action}</Table.DataCell>
                                <Table.DataCell>{lastEventResponse}</Table.DataCell>{' '}
                                {/* Insert the last event's response here */}
                            </Table.ExpandableRow>
                        );
                    })}
                </Table.Body>
            </Table>
        </>
    );
};

export default HealthStatusView;
