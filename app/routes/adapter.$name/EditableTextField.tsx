import { HStack, VStack, TextField, Label, BodyLong } from '@navikt/ds-react';

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
                    <VStack justify={'space-between'} className="">
                        <Label>{label}</Label>
                        <BodyLong className="min-h-15 pt-3">{value}</BodyLong>
                    </VStack>
                )}
            </VStack>
        </HStack>
    );
}
