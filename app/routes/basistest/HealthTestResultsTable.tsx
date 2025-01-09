import React from 'react';
import { Table } from '@navikt/ds-react';
import { formatTimeOnly } from '~/utils/dateUtils';
import { IHealthData } from '~/types/BasicTest';

interface TestResultsTableProps {
    logResults: IHealthData[] | null;
}

// Translation mapping
const statusTranslations: { [key: string]: string } = {
    SENT_FROM_CONSUMER_TO_PROVIDER: 'Sendt fra konsumer til provider',
    RECEIVED_IN_PROVIDER_FROM_CONSUMER: 'Mottatt i provider fra konsumer',
    APPLICATION_HEALTHY: 'Adapter er ok',
    RECEIVED_IN_CONSUMER_FROM_PROVIDER: 'Mottatt i consumer fra provider',
};

function HealthTestResultsTable({ logResults }: TestResultsTableProps) {
    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Komponent</Table.HeaderCell>
                    <Table.HeaderCell>Melding</Table.HeaderCell>
                    <Table.HeaderCell>Tid</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {logResults?.map((result, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>{result.component}</Table.DataCell>
                        <Table.DataCell>
                            {statusTranslations[result.status] || result.status}
                        </Table.DataCell>
                        <Table.DataCell>{formatTimeOnly(result.timestamp)}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

export default HealthTestResultsTable;
