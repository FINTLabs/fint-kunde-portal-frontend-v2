import React from 'react';
import { Textarea, TextField, VStack } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';
import { LabelValuePanel } from '~/components/shared/LabelValuePanel';

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
                <LabelValuePanel label="Beskrivelse" value={client.shortDescription} />
            )}

            {isEditing ? (
                <Textarea
                    label="Note"
                    size="small"
                    // hideLabel={true}
                    value={client.note}
                />
            ) : (
                <LabelValuePanel label="Note" value={client.note} />
            )}

            <LabelValuePanel label="Navn" value={client.name} />

            <LabelValuePanel
                label="Managed"
                value={client.managed ? 'Automatisk opprettet' : 'Manuelt opprettet'}
            />

            <LabelValuePanel label="Asset Id" value={client.assetId} />

            <LabelValuePanel label="Components" value={client.components.length.toString()} />
        </VStack>
        {/*</HStack>*/}
    </>
);

export default ClientDetails;
