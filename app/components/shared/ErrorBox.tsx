import { BodyLong, Box } from '@navikt/ds-react';

export function ErrorBox({ message }: { message: string }) {
    return (
        <Box padding="4" background="surface-danger-moderate">
            <BodyLong>{message}</BodyLong>
        </Box>
    );
}
