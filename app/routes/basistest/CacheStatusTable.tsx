import React from 'react';
import { Table, BodyShort, Label, Tooltip } from '@navikt/ds-react';
import { IBasicTestResult } from '~/types/BasicTest';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';

interface TestResultsTableProps {
    logResults: IBasicTestResult[] | null;
}

const CacheStatusTable: React.FC<TestResultsTableProps> = ({ logResults }) => {
    console.log(logResults);
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
                                    <Table.DataCell>
                                        <Tooltip content={result.status}>
                                            {result.status === 'OK' ? (
                                                <CheckmarkCircleIcon
                                                    title="ok"
                                                    fontSize="1.5rem"
                                                    className={'text-green-600'}
                                                />
                                            ) : (
                                                <XMarkOctagonIcon
                                                    title="error"
                                                    fontSize="1.5rem"
                                                    className={'navds-error-message'}
                                                />
                                            )}
                                        </Tooltip>
                                    </Table.DataCell>
                                    <Table.DataCell>{result.resource}</Table.DataCell>
                                    <Table.DataCell>
                                        {Number(result.lastUpdated) === -1
                                            ? '0'
                                            : result.lastUpdated}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {Number(result.size) === -1 ? '0' : result.size}
                                    </Table.DataCell>
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
