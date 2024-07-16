import React from 'react';
import { Table, BodyShort, Label } from '@navikt/ds-react';

interface TestResultsTableProps {
    logResults: any[] | null; // Replace 'any[]' with the appropriate type for your log results
}

const HealthStatusTable: React.FC<TestResultsTableProps> = ({ logResults }) => {
    return (
        <>
            {logResults ? (
                <>
                    <Label>Helsestatus</Label>
                    <Table size="small">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Component</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Time</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {logResults.map((result, index) => (
                                <Table.Row key={index}>
                                    <Table.DataCell>{result.tid}</Table.DataCell>
                                    <Table.DataCell>{result.status}</Table.DataCell>
                                    <Table.DataCell>{result.env}</Table.DataCell>
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

export default HealthStatusTable;
