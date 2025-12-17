import { BodyShort, Box, Button, Table } from '@navikt/ds-react';
import React, { useState } from 'react';

import { IComponentAccessLog } from '~/types/Access';
import { formatDate } from '~/utils/dateUtils';

interface ComponentAccessLogProps {
    accessLog: IComponentAccessLog | null;
}

export default function ComponentAccessLog({ accessLog }: ComponentAccessLogProps) {
    const [showAllLogs, setShowAllLogs] = useState(false);

    const formatAccessStatus = (hadAccess: boolean): string => {
        return hadAccess ? 'Tilgang' : 'Ingen tilgang';
    };

    const getAccessStatusColorClass = (hadAccess: boolean): string => {
        return hadAccess ? 'text-green-600' : 'text-red-600';
    };

    if (!accessLog || !accessLog.accessLogs || accessLog.accessLogs.length === 0) {
        return (
            <Box padding="4">
                <BodyShort>Ingen tilgangslogger registrert</BodyShort>
            </Box>
        );
    }

    const logCount = accessLog.accessLogs.length;
    const hasMoreThanTenLogs = logCount > 10;
    const logsToShow = showAllLogs ? accessLog.accessLogs : accessLog.accessLogs.slice(0, 10) || [];

    return (
        <Box>
            <Box paddingBlock="2 4">
                {hasMoreThanTenLogs && !showAllLogs ? (
                    <>
                        <BodyShort size="small" textColor="subtle">
                            Tilgangslogg for {accessLog.username}
                        </BodyShort>
                        <BodyShort size="small" textColor="subtle" className="mt-2">
                            Viser de siste 10 loggene
                        </BodyShort>
                    </>
                ) : (
                    <BodyShort size="small" textColor="subtle">
                        Tilgangslogg for {accessLog.username} ({logCount} logger)
                    </BodyShort>
                )}
            </Box>

            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Tidspunkt</Table.HeaderCell>
                        <Table.HeaderCell>Domene</Table.HeaderCell>
                        <Table.HeaderCell>Pakke</Table.HeaderCell>
                        <Table.HeaderCell>Ressurs</Table.HeaderCell>
                        <Table.HeaderCell>Tilgang</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {logsToShow.map((log, idx) => (
                        <Table.Row key={`${log.timestamp}-${idx}`}>
                            <Table.DataCell>
                                <BodyShort size="small">{formatDate(log.timestamp)}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort size="small">{log.domain}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort size="small">{log.pkg}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort size="small">{log.resource}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort
                                    size="small"
                                    className={getAccessStatusColorClass(log.hadAccess)}>
                                    {formatAccessStatus(log.hadAccess)}
                                </BodyShort>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {hasMoreThanTenLogs && !showAllLogs && (
                <Box paddingBlock="4 0">
                    <Button variant="secondary" size="small" onClick={() => setShowAllLogs(true)}>
                        Vis full logg
                    </Button>
                </Box>
            )}
        </Box>
    );
}
