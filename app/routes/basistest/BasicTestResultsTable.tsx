import React from 'react';
import { Table, BodyShort } from '@navikt/ds-react';

interface TestResultsTableProps {
    logResults: any[] | null; // Replace 'any[]' with the appropriate type for your log results
}

const BasicTestResultsTable: React.FC<TestResultsTableProps> = ({ logResults }) => {
    return (
        <>
            {logResults ? (
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Tid</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Miljø</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Ressurs</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Gjenstående sjekker</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Relasjonsfeil</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Sunne lenker</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Last ned rapport</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {logResults.map((result, index) => (
                            <Table.Row key={index}>
                                <Table.DataCell>{result.tid}</Table.DataCell>
                                <Table.DataCell>{result.status}</Table.DataCell>
                                <Table.DataCell>{result.env}</Table.DataCell>
                                <Table.DataCell>{result.ressurs}</Table.DataCell>
                                <Table.DataCell>{result.anything}</Table.DataCell>
                                <Table.DataCell>{result.relasjonsfeil}</Table.DataCell>
                                <Table.DataCell>{result.sunneLenker}</Table.DataCell>
                                <Table.DataCell>
                                    <a href={result.rapportLink}>Last ned rapport</a>
                                </Table.DataCell>
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

export default BasicTestResultsTable;
