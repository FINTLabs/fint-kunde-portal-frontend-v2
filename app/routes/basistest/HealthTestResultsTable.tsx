import React from 'react';
import { Table } from '@navikt/ds-react';
import { formatDate } from '~/utils/dateUtils';
import { IHealthData } from '~/types/BasicTest';

interface TestResultsTableProps {
    logResults: IHealthData[] | null;
}

function HealthTestResultsTable({ logResults }: TestResultsTableProps) {
    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Komponent</Table.HeaderCell>
                    <Table.HeaderCell>Tid</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {logResults?.map((result, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>{result.status}</Table.DataCell>
                        <Table.DataCell>{result.component}</Table.DataCell>
                        <Table.DataCell>{formatDate(result.timestamp)}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

export default HealthTestResultsTable;
