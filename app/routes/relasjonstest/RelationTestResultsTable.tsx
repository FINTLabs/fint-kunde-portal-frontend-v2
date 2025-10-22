import React from 'react';
import { Loader, Table, Tooltip } from '@navikt/ds-react';
import { CheckmarkCircleIcon, DownloadIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { ILogResults } from '~/types/RelationTest';
import { parseDate } from '~/utils/dateUtils';

interface TestResultsTableProps {
    logResults: ILogResults[];
}

const RelationTestResultsTable = ({ logResults }: TestResultsTableProps) => {
    const handleDownload = async (id: string) => {
        try {
            const response = await fetch(`/relasjonstest/${id}`, {
                method: 'GET',
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relasjonstest_${id}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            throw new Response('Failed to download the file', {
                status: 500,
                statusText: 'Failed to download the file',
            });
        }
    };

    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tid</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Miljø</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Ressurs</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Gjenstående</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Feil</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Ok</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'} />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {logResults
                    .sort((a, b) => parseDate(b.time).getTime() - parseDate(a.time).getTime())
                    .map((result, index) => (
                        <Table.Row key={index}>
                            <Table.DataCell>
                                {result.status === 'FAILED' && (
                                    <Tooltip content={result.errorMessage || 'An error occurred'}>
                                        <XMarkOctagonIcon
                                            title="FAILED"
                                            fontSize="1.5rem"
                                            className={'navds-error-message'}
                                        />
                                    </Tooltip>
                                )}
                                {result.status === 'COMPLETED' && (
                                    <CheckmarkCircleIcon title="COMPLETED" fontSize="1.5rem" />
                                )}
                                {result.status === 'IN_QUEUE' || result.status === 'PROCESSING' || (
                                    // <ArrowCirclepathIcon title={result.status} fontSize="1.5rem" />
                                    <Loader size="xsmall" title="Venter..." />
                                )}
                            </Table.DataCell>
                            <Table.DataCell>{result.time}</Table.DataCell>
                            <Table.DataCell>{result.env}</Table.DataCell>
                            <Table.DataCell>{result.uri}</Table.DataCell>

                            <Table.DataCell align={'center'}>
                                {result.totalRequests -
                                    result.healthyRelations -
                                    result.relationErrors}
                            </Table.DataCell>
                            <Table.DataCell align={'center'}>
                                {result.relationErrors}
                            </Table.DataCell>
                            <Table.DataCell align={'center'}>
                                {result.healthyRelations}
                            </Table.DataCell>
                            <Table.DataCell>
                                <button
                                    onClick={() => handleDownload(result.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}>
                                    <DownloadIcon title="Download Excel" fontSize="1.5rem" />
                                </button>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
            </Table.Body>
        </Table>
    );
};

export default RelationTestResultsTable;
