import React from 'react';
import { BodyShort, Table, Tooltip } from '@navikt/ds-react';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { formatTimeOnly } from '~/utils/dateUtils';
import { IResourceResult } from '~/types/BasicTest';

interface TestResultsTableProps {
    logResults: IResourceResult[] | null;
}

function CacheStatusTable({ logResults }: TestResultsTableProps) {
    if (!logResults) {
        return (
            <div>
                <BodyShort>NO RESOURCES FOUND</BodyShort>
            </div>
        );
    }

    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Ressurs</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Melding</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Cache størrelse</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tid</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {logResults.map((result, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>
                            <Tooltip content={result.status}>
                                {result.status === 'OK' ? (
                                    <CheckmarkCircleIcon
                                        title="OK"
                                        fontSize="1.5rem"
                                        className="text-green-600"
                                    />
                                ) : (
                                    <XMarkOctagonIcon
                                        title="Error"
                                        fontSize="1.5rem"
                                        className="navds-error-message"
                                    />
                                )}
                            </Tooltip>
                        </Table.DataCell>
                        <Table.DataCell>{result.resource}</Table.DataCell>
                        <Table.DataCell>{result.message || 'Ingen melding'}</Table.DataCell>
                        <Table.DataCell>{result.size <= 0 ? '' : result.size}</Table.DataCell>
                        <Table.DataCell>
                            {result.lastUpdated <= 0 ? '' : formatTimeOnly(result.lastUpdated)}
                        </Table.DataCell>{' '}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

export default CacheStatusTable;
