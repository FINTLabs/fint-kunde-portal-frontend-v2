import { BodyShort, Button, Heading, HStack, Label, Loader, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { EditableTextField } from '~/components/shared/EditableTextField';
import { FloppydiskIcon, PencilIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

interface IGeneralResource {
    name: string;
    shortDescription: string;
    note: string;
    managed?: boolean;
}

type GeneralDetailViewProps = {
    resource: IGeneralResource;
    onUpdate: (formData: FormData) => void;
    onDelete: (formData: FormData) => void;
};

export function GeneralDetailView({ resource, onUpdate, onDelete }: GeneralDetailViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [resourceShortDesc, setResourceShortDesc] = useState(resource.shortDescription);
    const [resourceNote, setResourceNote] = useState(resource.note);
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        setResourceShortDesc(resource.shortDescription);
        setResourceNote(resource.note);
        setIsEditing(false);
    };

    const handleConfirmDelete = () => {
        setLoading(true);
        const formData = new FormData();
        //formData.append('resourceName', resource.name);
        onDelete(formData);
    };

    const handleSave = () => {
        if (
            resourceNote.trim() !== resource.note ||
            resourceShortDesc.trim() !== resource.shortDescription
        ) {
            const formData = new FormData();
            formData.append('note', resourceNote);
            formData.append('shortDescription', resourceShortDesc);
            // formData.append('resourceName', resource.name);
            onUpdate(formData);
        }
        setIsEditing(false);
    };

    return (
        <VStack gap="6">
            <HStack justify={'space-between'} align={'center'}>
                <Heading align="start" size="medium">
                    Detaljer
                </Heading>
            </HStack>
            {loading && <Loader size="large" title="Venter..." />}
            <VStack>
                <Label>Navn</Label>
                <BodyShort>{resource.name}</BodyShort>
            </VStack>

            <EditableTextField
                label={'Tittel'}
                value={resourceShortDesc}
                isEditing={isEditing}
                setValue={setResourceShortDesc}
            />
            <HStack justify={'space-between'}>
                <EditableTextField
                    label={'Beskrivelse'}
                    value={resourceNote}
                    isEditing={isEditing}
                    setValue={setResourceNote}
                />
                <HStack className="w-full" align={'end'} justify={'end'} gap="2">
                    {/* Save Button */}
                    <Button
                        disabled={resource.managed}
                        icon={
                            isEditing ? (
                                <FloppydiskIcon title="Lagre" data-cy="save-button" />
                            ) : (
                                <PencilIcon title="Rediger" data-cy="edit-button" />
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
            </HStack>
        </VStack>
    );
}
