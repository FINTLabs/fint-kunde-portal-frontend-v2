import { FloppydiskIcon, PencilIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Box,
    Button,
    LocalAlert,
    Heading,
    HGrid,
    HStack,
    Label,
    Loader,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';
import { useState } from 'react';
import ConfirmAction from '~/components/shared/ConfirmActionModal';
import { IClient, IUserSession } from '~/types';
import AnalyticsApi from '~/api/AnalyticsApi';
import { useLoaderData } from 'react-router';

type DetailViewProps = {
    resource: IClient;
    onUpdate: (formData: FormData) => void;
    onDelete: (formData: FormData) => void;
};

export function DetailView({ resource, onUpdate, onDelete }: DetailViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [resourceShortDesc, setResourceShortDesc] = useState(resource.shortDescription);
    const [resourceNote, setResourceNote] = useState(resource.note);
    const [resourceModelVersion, setResourceModelVersion] = useState(
        resource.modelVersion ? resource.modelVersion : 'V3'
    );
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        setResourceShortDesc(resource.shortDescription);
        setResourceNote(resource.note);
        setIsEditing(false);
    };

    const handleConfirmDelete = () => {
        setLoading(true);
        const formData = new FormData();
        onDelete(formData);
    };

    const handleSave = () => {
        console.log('handleSave');
        const { userSession } = useLoaderData<{
            userSession: IUserSession;
        }>();
        void AnalyticsApi.trackButtonClick(
            'client-save-changes-button',
            location.pathname,
            userSession.selectedOrganization.name
        );

        if (
            resourceNote.trim() !== resource.note ||
            resourceShortDesc.trim() !== resource.shortDescription ||
            resourceModelVersion !== resource.modelVersion
        ) {
            const formData = new FormData();
            formData.append('note', resourceNote);
            formData.append('shortDescription', resourceShortDesc);
            formData.append('modelVersion', resourceModelVersion);
            onUpdate(formData);
        }
        setIsEditing(false);
    };

    return (
        <HGrid columns={2}>
            <VStack gap="space-6">
                <Heading align="start" size="medium">
                    Detaljer
                </Heading>
                {loading && <Loader size="large" title="Venter..." />}
                <Label>Navn</Label>
                <BodyShort>{resource.name}</BodyShort>

                {isEditing ? (
                    <TextField
                        label={'Tittel'}
                        value={resourceShortDesc}
                        size={'small'}
                        onChange={(e) => setResourceShortDesc(e.target.value)}
                    />
                ) : (
                    <>
                        <Label>Title</Label>
                        <BodyShort>{resource.shortDescription}</BodyShort>
                    </>
                )}

                {isEditing ? (
                    <TextField
                        label={'Beskrivelse'}
                        value={resourceNote}
                        size={'small'}
                        onChange={(e) => setResourceNote(e.target.value)}
                    />
                ) : (
                    <>
                        <Label>Beskrivelse</Label>
                        <BodyShort>{resource.note}</BodyShort>
                    </>
                )}

                {isEditing ? (
                    <Select
                        label="Velg modelversjon"
                        value={resourceModelVersion ?? 'V3'}
                        size="small"
                        description="Styrer hvilken informasjonsmodellversjon klienten kommuniserer med for utdanningsdomenet"
                        onChange={(e) =>
                            setResourceModelVersion(e.target.value === 'V3' ? 'V3' : 'V4')
                        }>
                        <option value="V3">V3</option>
                        <option value="V4">V4</option>
                    </Select>
                ) : (
                    <>
                        <Label>Model Version utdanningsdomenet</Label>
                        <BodyShort>{resource.modelVersion ?? 'V3'}</BodyShort>
                    </>
                )}
                {isEditing && (
                    <Box padding={'space-24'}>
                        <LocalAlert status="announcement" size={'small'}>
                            <LocalAlert.Header>
                                <LocalAlert.Title>Endringen i klienten</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                For at endringen skal tre i kraft, må nytt token hentes fra klienten
                            </LocalAlert.Content>
                        </LocalAlert>
                    </Box>
                )}
            </VStack>

            <HStack gap="space-6" align="end" justify="end">
                <Button
                    disabled={resource.managed}
                    icon={
                        isEditing ? (
                            <FloppydiskIcon title="Lagre" />
                        ) : (
                            <PencilIcon title="Rediger" />
                        )
                    }
                    variant="tertiary"
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                />

                {!isEditing && !resource.managed && (
                    <ConfirmAction
                        buttonText={'delete'}
                        showButtonText={false}
                        subTitleText={`Er du sikker på at du vil slette ${resource.name}?`}
                        onConfirm={handleConfirmDelete}
                        buttonVariant="tertiary"
                        buttonSize={'medium'}
                        icon={<TrashIcon aria-hidden />}
                    />
                )}

                {isEditing && (
                    <Button
                        icon={<XMarkIcon title="Avbryt" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={handleCancel}
                    />
                )}
            </HStack>
        </HGrid>
    );
}
