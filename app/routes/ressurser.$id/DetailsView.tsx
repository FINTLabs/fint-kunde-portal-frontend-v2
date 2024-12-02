import { BodyShort, Button, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { EditableTextField } from '~/components/shared/EditableTextField';
import { FloppydiskIcon, PencilIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';
import { IAsset } from '~/types/Asset';

type DetailsViewProps = {
    asset: IAsset;
    onUpdate: (formData: FormData) => void;
    onDelete: (formData: FormData) => void;
};

export function DetailsView({ asset, onUpdate, onDelete }: DetailsViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [resourceShortDesc, setResourceShortDesc] = useState(asset.description);

    const handleCancel = () => {
        setResourceShortDesc(asset.description);
        setIsEditing(false);
    };

    const handleConfirmDelete = () => {
        const formData = new FormData();
        //formData.append('resourceName', resource.name);
        onDelete(formData);
    };

    const handleSave = () => {
        if (resourceShortDesc.trim() !== asset.description) {
            const formData = new FormData();
            formData.append('assetDescription', resourceShortDesc);
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
            <VStack>
                <Label>Navn</Label>
                <BodyShort>{asset.name}</BodyShort>
            </VStack>
            <VStack>
                <Label>Assetid</Label>
                <BodyShort>{asset.assetId}</BodyShort>
            </VStack>

            <EditableTextField
                label={'Beskrivelse'}
                value={resourceShortDesc}
                isEditing={isEditing}
                setValue={setResourceShortDesc}
            />
            <HStack justify={'space-between'}>
                <HStack className="w-full" align={'end'} justify={'end'} gap="2">
                    {/* Save Button */}
                    <Button
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

                    {!isEditing && (
                        <ConfirmAction
                            buttonText={'delete'}
                            showButtonText={false}
                            subTitleText={`Er du sikker på at du vil slette ${asset.name}?`}
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
