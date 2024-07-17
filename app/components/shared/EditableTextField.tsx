import { HStack, VStack, TextField } from '@navikt/ds-react';
import { LabelValuePanel } from './LabelValuePanel';

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
            <VStack className="h-20">
                {isEditing ? (
                    <TextField
                        value={value}
                        type="text"
                        htmlSize={value.length + 10 < maxChars ? value.length + 10 : maxChars}
                        label={label}
                        onChange={(e) => setValue(e.target.value)}></TextField>
                ) : (
                    <LabelValuePanel label={label} value={value}></LabelValuePanel>
                )}
            </VStack>
        </HStack>
    );
}
