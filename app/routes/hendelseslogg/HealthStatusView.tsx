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

const HealthStatusView: React.FC<HealthStatusProps> = ({ logs }) => {
    return (
        <>
            <Label>Helsestatus</Label>
            <Table size="medium">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                        <Table.HeaderCell scope="col">HendelsesID</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Tid</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Hendelse</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {logs.map((log, index) => {
                        const isError =
                            log.events.length > 0 &&
                            log.events[log.events.length - 1].status === 'ERROR'
                                ? 'bg-red-500'
                                : '';

                        const lastEventResponse =
                            log.events.length > 0
                                ? log.events[log.events.length - 1].status +
                                  log.events[log.events.length - 1].response
                                : '';

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
                                                    className="my-4 mx-2"
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
                                                        <Label>Respons:</Label>
                                                        <BodyShort>{event.response}</BodyShort>
                                                    </HStack>
                                                    <HStack>
                                                        <Label>Melding:</Label>
                                                        <BodyShort>{event.melding}</BodyShort>
                                                    </HStack>
                                                </CellComponent>
                                            );
                                        })}
                                    </VStack>
                                }>
                                <Table.DataCell scope="row">{log.id}</Table.DataCell>
                                <Table.DataCell>{formattedDate(log.timestamp)}</Table.DataCell>
                                <Table.DataCell>{log.action}</Table.DataCell>
                                <Table.DataCell className={isError}>
                                    {lastEventResponse}
                                </Table.DataCell>
                            </Table.ExpandableRow>
                        );
                    })}
                </Table.Body>
            </Table>
        </>
    );
};

export default HealthStatusView;
