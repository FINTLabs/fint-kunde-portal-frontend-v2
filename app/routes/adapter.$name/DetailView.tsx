import { VStack, HStack, Heading, Button } from '@navikt/ds-react';
import { useSubmit } from '@remix-run/react';
import { useState } from 'react';
import { IAdapter } from '~/types/types';
import { EditableTextField } from '../../components/shared/EditableTextField';
import { PencilIcon, FloppydiskIcon } from '@navikt/aksel-icons';

export function DetailView({ adapter }: { adapter: IAdapter }) {
    const [isEditing, setIsEditing] = useState(false);
    const [adapterShortDesc, setAdapterShortDesc] = useState(adapter.shortDescription);
    const [adapterNote, setAdapterNote] = useState(adapter.note);

    const submit = useSubmit();

    return (
        <VStack gap="3">
            <HStack justify={'space-between'} align={'center'}>
                <Heading align="start" size="medium">
                    Detaljer
                </Heading>
            </HStack>
            <EditableTextField
                label={'Kort beskrivelse'}
                value={adapterShortDesc}
                isEditing={isEditing}
                setValue={setAdapterShortDesc}
            />
            <HStack justify={'space-between'}>
                <EditableTextField
                    label={'Note'}
                    value={adapterNote}
                    isEditing={isEditing}
                    setValue={setAdapterNote}
                />
                <HStack className="w-full" align={'end'} justify={'end'}>
                    <Button
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
                </HStack>
            </HStack>
        </VStack>
    );
}
