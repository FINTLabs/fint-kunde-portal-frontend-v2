import { HStack, VStack, TextField, Label, BodyShort } from '@navikt/ds-react';
import React from 'react';

export function EditableTextField({
    label,
    value,
    isEditing,
    setValue,
}: {
    label: string;
    value: string;
    isEditing: boolean;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
    const maxChars = 94;
    return (
        <HStack justify={'space-between'}>
            <VStack>
                {isEditing ? (
                    <TextField
                        value={value}
                        type="text"
                        htmlSize={value.length + 10 < maxChars ? value.length + 10 : maxChars}
                        label={label}
                        onChange={(e) => setValue(e.target.value)}></TextField>
                ) : (
                    <>
                        <Label>{label}</Label>
                        <BodyShort>{value}</BodyShort>
                    </>
                )}
            </VStack>
        </HStack>
    );
}
