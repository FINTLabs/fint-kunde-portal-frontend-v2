import React from 'react';
import { BodyLong, BodyShort, Box, Button, HStack, Label } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';
import { PencilIcon } from '@navikt/aksel-icons';

interface ClientComponentProps {
    client: IClient;
}

const ClientDetails: React.FC<ClientComponentProps> = ({ client }) => (
    <Box padding="4">
        <Label>Note</Label>
        <HStack className="!flex !justify-between !items-center">
            <BodyLong>{client.note}</BodyLong>
            <BodyShort>{client.managed ? 'Manuelt opprettet' : 'Automatisk opprettet'}</BodyShort>
            <Button icon={<PencilIcon title="Rediger" />} variant="tertiary" />
        </HStack>
    </Box>
);

export default ClientDetails;
