import React from 'react';
import { Table, BodyShort } from '@navikt/ds-react';
import { IHealthTestResult } from '~/types/BasicTest';

interface TestResultsTableProps {
    logResults: IHealthTestResult[] | null;
}

const HealthTestResultsTable: React.FC<TestResultsTableProps> = ({ logResults }) => {
    return (
        <>
            {logResults ? (
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Component</Table.HeaderCell>
                            <Table.HeaderCell>Time</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {logResults.map((result, index) => (
                            <Table.Row key={index}>
                                <Table.DataCell>{result.status}</Table.DataCell>
                                <Table.DataCell>{result.component}</Table.DataCell>
                                <Table.DataCell>{result.time}</Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            ) : (
                <div>
                    <BodyShort>please use the form to create a report</BodyShort>
                </div>
            )}
        </>
    );
};

export default HealthTestResultsTable;
