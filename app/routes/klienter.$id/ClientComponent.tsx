import React from 'react';
import { Box, BodyShort, Heading, Label } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';

interface ClientComponentProps {
    client: IClient;
}

const ClientComponent: React.FC<ClientComponentProps> = ({ client }) => (
    <Box padding={'10'}>
        <Box padding="4">
            <Heading size="medium">{client.name}</Heading>
            <BodyShort>{client.note}</BodyShort>
            <Label>Mananged: </Label>
            {client.managed ? 'True' : 'False'}
        </Box>
    </Box>
);

export default ClientComponent;
