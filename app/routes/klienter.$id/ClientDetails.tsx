import React from 'react';
import { BodyShort, HStack, Label, Textarea, TextField, VStack } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';

interface ClientComponentProps {
    client: IClient;
    isEditing: boolean;
}

const ClientDetails: React.FC<ClientComponentProps> = ({ client, isEditing }) => (
    <>
        {/*<HStack className="!flex !justify-between !items-center">*/}
        <VStack gap={'2'}>
            {isEditing ? (
                <TextField
                    label="Beskrivelse"
                    size="small"
                    // hideLabel={true}
                    value={client.shortDescription}
                />
            ) : (
                <HStack gap={'2'}>
                    <Label>Beskrivelse</Label>
                    <BodyShort>{client.shortDescription}</BodyShort>
                </HStack>
            )}

            {isEditing ? (
                <Textarea
                    label="Note"
                    size="small"
                    // hideLabel={true}
                    value={client.note}
                />
            ) : (
                <HStack gap={'2'}>
                    <Label>Note</Label>
                    <BodyShort>{client.note}</BodyShort>
                </HStack>
            )}

            <HStack gap={'2'}>
                <Label>Navn</Label>
                <BodyShort>{client.name}</BodyShort>
            </HStack>

            <HStack gap={'2'}>
                <Label>Asset Id</Label>
                <BodyShort>{client.assetId}</BodyShort>
            </HStack>

            <HStack gap={'2'}>
                <Label>Components</Label>
                <BodyShort>{client.components.length}</BodyShort>
            </HStack>
        </VStack>
        {/*</HStack>*/}
    </>
);

export default ClientDetails;
