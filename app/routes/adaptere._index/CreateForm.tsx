import { BodyShort, Box, Button, Fieldset, HStack, Textarea, TextField } from '@navikt/ds-react';
import React, { useState } from 'react';

type Errors = { name?: string; description?: string; detailedInfo?: string };

interface AdapterCreateFormProps {
    onCancel: () => void;
    onSave: (formData: FormData) => void;
    orgName: string;
}

export default function AdapterCreateForm({ onCancel, onSave, orgName }: AdapterCreateFormProps) {
    const [errors, setErrors] = useState<Errors>({});
    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputDetailedInfo, setInputDetailedInfo] = useState('');

    const handleSubmit = () => {
        const newErrors: Errors = {};
        if (!inputName) {
            newErrors.name = 'Navn er påkrevd';
        }
        if (!inputDescription) {
            newErrors.description = 'Tittel er påkrevd';
        }
        if (!inputDetailedInfo) {
            newErrors.detailedInfo = 'Detaljert informasjon er påkrevd';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', inputName);
            formData.append('description', inputDescription);
            formData.append('detailedInfo', inputDetailedInfo);
            onSave(formData);
        }
    };

    return (
        <Box paddingBlock="space-24">
            <Fieldset legend="Opprett ny adapter" data-cy="create-form">
                <HStack gap="space-4" align="center">
                    <TextField
                        data-cy="input-name"
                        name="name"
                        label="Navn"
                        type="text"
                        size="small"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        error={errors.name}
                    />
                    <BodyShort className={!errors.name ? 'pt-6' : undefined}>
                        @adapter.{orgName.replace(/_/g, '.')}
                    </BodyShort>
                </HStack>

                <TextField
                    data-cy="input-description"
                    name="description"
                    label="Tittel"
                    type="text"
                    size={'small'}
                    value={inputDescription}
                    onChange={(e) => setInputDescription(e.target.value)}
                    error={errors.description}
                />

                <Textarea
                    data-cy="input-detailedInfo"
                    name="detailedInfo"
                    label="Beskrivelse"
                    value={inputDetailedInfo}
                    onChange={(e) => setInputDetailedInfo(e.target.value)}
                    error={errors.detailedInfo}
                />
                <HStack gap="space-4">
                    <Button title="Opprett" onClick={handleSubmit} data-cy="save-button">
                        Opprett
                    </Button>
                    <Button variant="secondary" onClick={onCancel}>
                        Avbryt
                    </Button>
                </HStack>
            </Fieldset>
        </Box>
    );
}
