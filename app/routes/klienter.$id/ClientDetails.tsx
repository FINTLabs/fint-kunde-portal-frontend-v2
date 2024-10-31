import React from 'react';
import { Textarea, TextField, VStack } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';
import { LabelValuePanel } from '~/components/shared/LabelValuePanel';

interface ClientComponentProps {
    client: IClient;
    isEditing: boolean;
    onChangeShortDescription: (value: string) => void;
    onChangeNote: (value: string) => void;
}

const ClientDetails: React.FC<ClientComponentProps> = ({
    client,
    isEditing,
    onChangeShortDescription,
    onChangeNote,
}) => (
    <VStack gap={'2'}>
        {isEditing ? (
            <TextField
                label="Beskrivelse"
                size="small"
                value={client.shortDescription}
                onChange={(e) => onChangeShortDescription(e.target.value)}
            />
        ) : (
            <LabelValuePanel label="Beskrivelse" value={client.shortDescription} />
        )}

        {isEditing ? (
            <Textarea
                label="Note"
                size="small"
                value={client.note}
                onChange={(e) => onChangeNote(e.target.value)}
            />
        ) : (
            <LabelValuePanel label="Note" value={client.note} />
        )}

        <LabelValuePanel label="Navn" value={client.name} />
        <LabelValuePanel
            label={client.managed ? 'Automatisk opprettet' : 'Manuelt opprettet'}
            value=""
        />
        <LabelValuePanel
            label="Asset Id"
            value={client.assetId ? client.assetId.toString() : 'N/A'}
        />

        <LabelValuePanel label="Komponenter" value={client.components.length.toString()} />
    </VStack>
);

export default ClientDetails;
