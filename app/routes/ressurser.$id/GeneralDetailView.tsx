import { Heading, HStack, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { EditableTextField } from '~/components/shared/EditableTextField';
import { IAsset } from '~/types/Asset';
import { LabelValuePanel } from '~/components/shared/LabelValuePanel';
import { ToggleEditSaveButton } from '~/components/shared/EditSaveButton';

interface TestAddFormProps {
    asset: IAsset;
    onSave: (description: string) => void;
}

export const GeneralDetailView: React.FC<TestAddFormProps> = ({ asset, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(asset.description);

    const toggleEditSave = () => {
        if (isEditing) {
            if (description.trim() !== asset.description) {
                //todo: check for blank?
                onSave(description);
            }
        }
        setIsEditing(!isEditing);
    };

    return (
        <VStack gap="3">
            <HStack justify={'space-between'} align={'center'}>
                <Heading align="start" size="medium">
                    Detaljer
                </Heading>
            </HStack>

            <HStack justify={'space-between'} gap="8">
                <VStack gap="6">
                    <LabelValuePanel label="Ressurs Id" value={asset.assetId} />
                    <LabelValuePanel label="Navn" value={asset.name} />
                </VStack>

                <HStack className="w-full" align={'end'} justify={'space-between'}>
                    <EditableTextField
                        label={'Beskrivelse'}
                        value={description}
                        isEditing={isEditing}
                        setValue={setDescription}
                    />

                    <ToggleEditSaveButton isEditing={isEditing} onClick={toggleEditSave} />
                </HStack>
            </HStack>
        </VStack>
    );
};
