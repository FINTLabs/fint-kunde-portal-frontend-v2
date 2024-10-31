import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { IAdapter } from '~/types/types';
import { EditableTextField } from '~/components/shared/EditableTextField';
import { FloppydiskIcon, PencilIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';

import { LabelValuePanel } from '~/components/shared/LabelValuePanel';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

export function GeneralDetailView({
    adapter,
    onUpdate,
    onDelete,
}: {
    adapter: IAdapter;
    onUpdate: (formData: FormData) => void;
    onDelete: (formData: FormData) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [adapterShortDesc, setAdapterShortDesc] = useState(adapter.shortDescription);
    const [adapterNote, setAdapterNote] = useState(adapter.note);

    const handleCancel = () => {
        setAdapterShortDesc(adapter.shortDescription);
        setAdapterNote(adapter.note);
        setIsEditing(false);
    };

    const handleConfirmDelete = () => {
        const formData = new FormData();
        formData.append('adapterName', adapter.name);
        onDelete(formData);
    };

    const handleSave = () => {
        if (
            adapterNote.trim() !== adapter.note ||
            adapterShortDesc.trim() !== adapter.shortDescription
        ) {
            const formData = new FormData();
            formData.append('note', adapterNote);
            formData.append('shortDescription', adapterShortDesc);
            formData.append('adapterName', adapter.name);
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
            <LabelValuePanel label="Navn" value={adapter.name} />

            <LabelValuePanel label="Opprettet" value={adapter.managed ? 'Automatisk' : 'Manuelt'} />
            <EditableTextField
                label={'Tittel'}
                value={adapterShortDesc}
                isEditing={isEditing}
                setValue={setAdapterShortDesc}
            />
            <HStack justify={'space-between'}>
                <EditableTextField
                    label={'Beskrivelse'}
                    value={adapterNote}
                    isEditing={isEditing}
                    setValue={setAdapterNote}
                />
                <HStack className="w-full" align={'end'} justify={'end'} gap="2">
                    {/* Save Button */}
                    <Button
                        disabled={adapter.managed}
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

                    {!isEditing && !adapter.managed && (
                        <ConfirmAction
                            buttonText={'delete'}
                            showButtonText={false}
                            subTitleText={`Er du sikker på at du vil slette ${adapter.name}?`}
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
