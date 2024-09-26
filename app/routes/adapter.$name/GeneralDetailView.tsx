import { VStack, HStack, Heading, Button, Label, BodyShort } from '@navikt/ds-react';
import { useSubmit } from '@remix-run/react';
import { useState } from 'react';
import { IAdapter } from '~/types/types';
import { EditableTextField } from '~/components/shared/EditableTextField';
import { PencilIcon, FloppydiskIcon, XMarkIcon, TrashIcon } from '@navikt/aksel-icons';

import { LabelValuePanel } from '~/components/shared/LabelValuePanel';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

export function GeneralDetailView({ adapter }: { adapter: IAdapter }) {
    const [isEditing, setIsEditing] = useState(false);
    const [adapterShortDesc, setAdapterShortDesc] = useState(adapter.shortDescription);
    const [adapterNote, setAdapterNote] = useState(adapter.note);

    const submit = useSubmit();

    const handleCancel = () => {
        setAdapterShortDesc(adapter.shortDescription);
        setAdapterNote(adapter.note);
        setIsEditing(false);
    };

    const handleConfirmDelete = () => {
        // Using useSubmit to submit a form for deletion
        submit(null, {
            method: 'POST',
            action: 'delete',
            navigate: false,
        });
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
                        type="submit"
                        onClick={() => {
                            if (isEditing) {
                                if (
                                    adapterNote.trim() !== adapter.note ||
                                    adapterShortDesc.trim() !== adapter.shortDescription
                                ) {
                                    submit(
                                        {
                                            note: adapterNote,
                                            shortDescription: adapterShortDesc,
                                        },
                                        {
                                            method: 'POST',
                                            action: 'update',
                                            navigate: false,
                                        }
                                    );
                                }
                            }
                            setIsEditing(!isEditing);
                        }}
                    />

                    {!isEditing && !adapter.managed && (
                        <ConfirmAction
                            buttonText={'delete'}
                            titleText={'Slett adapter'}
                            showButtonText={false}
                            subTitleText={'Er du sikker på at du vil slette dette adapteret?'}
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
