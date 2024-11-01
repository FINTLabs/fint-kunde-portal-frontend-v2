import React from 'react';
import { BodyShort, Table } from '@navikt/ds-react';
import { ArrowCirclepathIcon, CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { ILogResults } from '~/types/RelationTest';

interface TestResultsTableProps {
    logResults: ILogResults[];
}

const RelationTestResultsTable: React.FC<TestResultsTableProps> = ({ logResults }) => {
    const parseDate = (timeString: string) => {
        const [datePart, timePart] = timeString.split(' ');
        const [day, month] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        const date = new Date();
        date.setDate(day);
        date.setMonth(month - 1);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };

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
                            <Table.HeaderCell scope="col">Relasjonsfeil</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Sunne lenker</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {logResults
                            .sort(
                                (a, b) => parseDate(b.time).getTime() - parseDate(a.time).getTime()
                            )
                            .map((result, index) => (
                                <Table.Row key={index}>
                                    <Table.DataCell>
                                        {result.status === 'FAILED' && (
                                            <XMarkOctagonIcon
                                                title="FAILED"
                                                fontSize="1.5rem"
                                                className={'navds-error-message'}
                                            />
                                        )}
                                        {result.status === 'COMPLETED' && (
                                            <CheckmarkCircleIcon
                                                title="COMPLETED"
                                                fontSize="1.5rem"
                                            />
                                        )}
                                        {result.status === 'RUNNING' && (
                                            <ArrowCirclepathIcon
                                                title="RUNNING"
                                                fontSize="1.5rem"
                                            />
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>{result.time}</Table.DataCell>
                                    <Table.DataCell>{result.env}</Table.DataCell>
                                    <Table.DataCell>{result.uri}</Table.DataCell>
                                    {result.status === 'FAILED' ? (
                                        <>
                                            <Table.DataCell colSpan={3}>
                                                {result.errorMessage}
                                            </Table.DataCell>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
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
