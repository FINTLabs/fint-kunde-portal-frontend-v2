import React from 'react';
import { Table, BodyShort, Label } from '@navikt/ds-react';
import { IBasicTestResult } from '~/types/BasicTest';

interface TestResultsTableProps {
    logResults: IBasicTestResult[] | null;
}

const CacheStatusTable: React.FC<TestResultsTableProps> = ({ logResults }) => {
    return (
        <>
            {logResults ? (
                <>
                    <Label>Cache status</Label>
                    <Table size="small">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Ressurs</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Sist oppdatert</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Cache størrelse</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Melding</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {logResults.map((result, index) => (
                                <Table.Row key={index}>
                                    <Table.DataCell>{result.status}</Table.DataCell>
                                    <Table.DataCell>{result.resource}</Table.DataCell>
                                    <Table.DataCell>{result.lastUpdated}</Table.DataCell>
                                    <Table.DataCell>{result.size}</Table.DataCell>
                                    <Table.DataCell>{result.message}</Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </>
            ) : (
                <div>
                    <BodyShort>please use the form to create a report</BodyShort>
                </div>
            )}
        </>
    );
};

export default CacheStatusTable;
