import { BodyShort, Box, Button, Table } from '@navikt/ds-react';
import React, { useState } from 'react';

import { IAccessAudit } from '~/types/Access';
import { formatDate } from '~/utils/dateUtils';

interface ComponentAccessAuditProps {
    audit: IAccessAudit | null;
}

export default function ComponentAccessAudit({ audit }: ComponentAccessAuditProps) {
    const [showAllRecords, setShowAllRecords] = useState(false);

    const formatChangeType = (changed: string): string => {
        switch (changed) {
            case 'COMPONENT':
                return 'Komponent';
            case 'RESOURCE':
                return 'Ressurs';
            case 'FIELD':
                return 'Felt';
            default:
                return changed;
        }
    };

    const formatChangeValue = (setTo: boolean | string): string => {
        if (typeof setTo === 'boolean') {
            return setTo ? 'Aktivert' : 'Deaktivert';
        }
        return String(setTo);
    };

    const getStatusColorClass = (setTo: boolean | string): string => {
        if (typeof setTo === 'boolean') {
            return setTo ? 'text-green-600' : 'text-red-600';
        }
        return '';
    };

    if (!audit || !audit.auditRecord || audit.auditRecord.length === 0) {
        return (
            <Box padding="4">
                <BodyShort>Ingen endringer registrert</BodyShort>
            </Box>
        );
    }

    const recordCount = audit.auditRecord.length;
    const hasMoreThanTenRecords = recordCount > 10;
    const recordsToShow = showAllRecords 
        ? audit.auditRecord 
        : (audit?.auditRecord?.slice(0, 10) || []);

    return (
        <Box>
            <Box paddingBlock="2 4">
                {hasMoreThanTenRecords && !showAllRecords ? (
                    <>
                        <BodyShort size="small" textColor="subtle">
                            Endringslogg for {audit.userName}
                        </BodyShort>
                        <BodyShort size="small" textColor="subtle" className="mt-2">
                            Viser de siste 10 endringene
                        </BodyShort>
                    </>
                ) : (
                    <BodyShort size="small" textColor="subtle">
                        Endringslogg for {audit.userName} ({recordCount} endringer)
                    </BodyShort>
                )}
            </Box>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Tidspunkt</Table.HeaderCell>
                        <Table.HeaderCell>Bruker</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Navn</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {recordsToShow.map((record, idx) => (
                        <Table.Row key={`${record.timeStamp}-${idx}`}>
                            <Table.DataCell>
                                <BodyShort size="small">
                                    {formatDate(record.timeStamp)}
                                </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort size="small">{record.portalUser}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort size="small">
                                    {formatChangeType(record.changes.changed)}
                                </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort size="small">{record.changes.name}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort
                                    size="small"
                                    className={getStatusColorClass(record.changes.setTo)}>
                                    {formatChangeValue(record.changes.setTo)}
                                </BodyShort>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {hasMoreThanTenRecords && !showAllRecords && (
                <Box paddingBlock="4 0">
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setShowAllRecords(true)}>
                        Vis full logg
                    </Button>
                </Box>
            )}
        </Box>
    );
}


