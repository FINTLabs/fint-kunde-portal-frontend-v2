import { BodyShort, Box, Heading } from '@navikt/ds-react';
import React from 'react';

import { IAccessAudit } from '~/types/Access';
import { formatDate } from '~/utils/dateUtils';

export default function AccessAudit({ audit }: { audit: IAccessAudit[] }) {
    return (
        <Box>
            <Heading size={'small'}>Endringslogg</Heading>
            {(!audit || audit.length === 0) && (
                <BodyShort size="small">Ingen endringer registrert.</BodyShort>
            )}
            {audit && audit.length > 0 && (
                <Box as="ul" paddingBlock="2">
                    {[...audit]
                        .sort((a, b) => b.timeStamp - a.timeStamp)
                        .map((entry, idx) => (
                            <li key={`${entry.timeStamp}-${idx}`}>
                                <BodyShort size="small">
                                    {formatDate(entry.timeStamp)} — {entry.changesByUser}
                                </BodyShort>
                            </li>
                        ))}
                </Box>
            )}
        </Box>
    );
}


