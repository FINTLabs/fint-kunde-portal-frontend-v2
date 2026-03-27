import { HStack, VStack, TextField, Label, BodyShort } from '@navikt/ds-react';
import React from 'react';

export function EditableTextField({
    label,
    value,
    isEditing,
    setValue,
    fullWidth = false,
}: {
    label: string;
    value: string;
    isEditing: boolean;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    fullWidth?: boolean;
}) {
    const maxChars = 94;
    return (
        <HStack justify={'space-between'}>
            <VStack className={fullWidth ? 'w-full' : undefined}>
                {isEditing ? (
                    <TextField
                        data-cy={`details-edit-${label}`}
                        value={value}
                        type="text"
                        size={'small'}
                        htmlSize={
                            fullWidth
                                ? undefined
                                : value.length + 10 < maxChars
                                  ? value.length + 10
                                  : maxChars
                        }
                        style={fullWidth ? { width: '100%' } : undefined}
                        label={label}
                        onChange={(e) => setValue(e.target.value)}></TextField>
                ) : (
                    <>
                        <Label>{label}</Label>
                        <BodyShort data-cy={`details-${label}`}>{value}</BodyShort>
                    </>
                )}
            </VStack>
        </HStack>
    );
}
