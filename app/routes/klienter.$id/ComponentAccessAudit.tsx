import { BodyShort, Box, Heading } from '@navikt/ds-react';
import React from 'react';

import { IAccessAudit } from '~/types/Access';
import { formatDate } from '~/utils/dateUtils';

interface ComponentAccessAuditProps {
    audit: IAccessAudit[];
}

export default function ComponentAccessAudit({ audit }: ComponentAccessAuditProps) {
    const formatChangeMessage = (
        changed: string,
        name: string,
        value: boolean | string
    ): string => {
        const changeType = changed.toLowerCase();
        const valueStr = typeof value === 'boolean' ? (value ? 'aktivert' : 'deaktivert') : value;

        switch (changed) {
            case 'COMPONENT':
                return `${changeType}: ${name} ble ${valueStr}`;
            case 'RESOURCE':
                return `${changeType}: ${name} ble ${valueStr}`;
            case 'FIELD':
                return `${changeType}: ${name} ble ${valueStr}`;
            default:
                return `${changed}: ${name} = ${valueStr}`;
        }
    };



    return (
        <Box>
            <Heading size={'small'}>Endringslogg -- {audit.length}</Heading>

            {audit?.length || audit?.length > 0 && (
                <Box as="ul" paddingBlock="2">
                    {audit?.map((auditEntry) =>
                        auditEntry.auditRecord?.map((record, idx) => (
                            <li key={`${record.timeStamp}-${idx}`}>
                                <BodyShort size="small">
                                    <strong>{formatDate(record.timeStamp)}</strong> — {record.portalUser}
                                </BodyShort>
                                <BodyShort size="small" className="ml-4">
                                    {formatChangeMessage(
                                        record.changes.changed,
                                        record.changes.name,
                                        record.changes.value
                                    )}
                                </BodyShort>
                            </li>
                        ))
                    )  }
                </Box>
            )}
        </Box>
    );
}


