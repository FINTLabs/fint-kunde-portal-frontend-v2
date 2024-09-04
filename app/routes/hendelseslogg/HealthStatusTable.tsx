import React from 'react';
import { Table, Label, Box } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Log } from '~/types/types';
import EventTable from './EventTable'; // Import the EventTable component

interface HealthStatusProps {
    logs: Log[];
}

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const time = date.toLocaleTimeString('no-NO');
    return `${d}.${m}.${y} ${time}`;
};

const HealthStatusTable: React.FC<HealthStatusProps> = ({ logs }) => {
    return (
        <>
            <Label>Helsestatus</Label>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        {/*<Table.HeaderCell scope="col">ID</Table.HeaderCell>*/}
                        <Table.HeaderCell scope="col">Time + Date</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.HeaderCell scope="col" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {logs.map((log, index) => {
                        const hasError = log.events.some((event) => event.response === 'ERROR');

                        return (
                            <Table.ExpandableRow
                                key={index}
                                content={
                                    <Box padding={'4'}>
                                        <EventTable events={log.events} />{' '}
                                        {/* Use the EventTable component */}
                                    </Box>
                                }>
                                {/*<Table.DataCell>*/}
                                {/*    <div>{log.id}</div>*/}
                                {/*</Table.DataCell>*/}
                                <Table.DataCell>
                                    <div>
                                        <div>{formatDate(log.timestamp)}</div>
                                        <div style={{ color: '#6A6A6A', fontSize: '0.875rem' }}>
                                            {log.id}
                                        </div>
                                    </div>
                                </Table.DataCell>
                                <Table.DataCell>{log.action}</Table.DataCell>
                                <Table.DataCell>
                                    {hasError && (
                                        <XMarkOctagonIcon
                                            style={{ color: 'red', marginRight: '0.5rem' }}
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

export default HealthStatusTable;
