import React from 'react';
import { BodyShort, Table } from '@navikt/ds-react';
import { CheckmarkCircleIcon, DownloadIcon } from '@navikt/aksel-icons';
import { Link } from '@remix-run/react';
import { ILogResults } from '~/types/RelationTest';

interface TestResultsTableProps {
    logResults: ILogResults[];
    orgName: string;
}

const RelationTestResultsTable: React.FC<TestResultsTableProps> = ({ logResults, orgName }) => {
    return (
        <>
            {logResults ? (
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Tid</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Miljø</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Ressurs</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Gjenstående sjekker</Table.HeaderCell>
                            <Table.HeaderCell scope="col" colSpan={2}>
                                Relasjonsfeil
                            </Table.HeaderCell>

                            <Table.HeaderCell scope="col">Sunne lenker</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {logResults.map((result, index) => (
                            <Table.Row key={result.id}>
                                <Table.DataCell>
                                    {result.status == 'COMPLETED' && (
                                        <CheckmarkCircleIcon title="a11y-title" fontSize="1.5rem" />
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>{result.time}</Table.DataCell>{' '}
                                <Table.DataCell>{result.env}</Table.DataCell>
                                <Table.DataCell>{result.uri}</Table.DataCell>{' '}
                                <Table.DataCell align={'center'}>
                                    {result.totalRequests -
                                        result.healthyRelations -
                                        result.relationErrors}
                                </Table.DataCell>
                                <Table.DataCell align={'center'}>
                                    {result.relationErrors}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {result.status !== 'STARTED' && (
                                        <Link
                                            to={`/link-walker/tasks/${orgName}/${result.id}/download`}>
                                            <DownloadIcon title="Rediger" />
                                        </Link>
                                    )}
                                </Table.DataCell>
                                <Table.DataCell align={'center'}>
                                    {result.healthyRelations}
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            ) : (
                <div>
                    <BodyShort>Please use the form to create a report</BodyShort>
                </div>
            )}
        </>
    );
};

export default RelationTestResultsTable;
