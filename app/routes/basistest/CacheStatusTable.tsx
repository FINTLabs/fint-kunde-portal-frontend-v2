import React from 'react';
import { Table, BodyShort, Label } from '@navikt/ds-react';

interface TestResultsTableProps {
    logResults: any[] | null; // Replace 'any[]' with the appropriate type for your log results
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
                                    <Table.DataCell>{result.env}</Table.DataCell>
                                    <Table.DataCell>{result.ressurs}</Table.DataCell>
                                    <Table.DataCell>{result.anything}</Table.DataCell>
                                    <Table.DataCell>{result.relasjonsfeil}</Table.DataCell>
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
