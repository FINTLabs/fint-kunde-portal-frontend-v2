import { BodyLong, Box } from '@navikt/ds-react';

export function InfoBox({ message }: { message: string }) {
    return (
        <Box padding="8" background="surface-info-moderate">
            <BodyLong>{message}</BodyLong>
        </Box>
    );
}
//TODO: remove this file
