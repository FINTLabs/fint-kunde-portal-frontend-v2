import React, { useState } from 'react';
import { Box, Button, HStack, Textarea, TextField, FormSummary } from '@navikt/ds-react';

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
        <Box paddingBlock="10" paddingInline="20" data-cy="create-form">
            <FormSummary>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">Opprett ny adapter</FormSummary.Heading>
                </FormSummary.Header>

                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <HStack className="flex !items-end" gap="2">
                            <TextField
                                data-cy="input-name"
                                name="name"
                                label="Navn"
                                type="text"
                                // htmlSize={50}
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                error={errors.name}
                            />
                            <span className="pb-3.5">@adapter.{orgName.replace(/_/g, '.')}</span>
                        </HStack>
                    </FormSummary.Answer>

                    <FormSummary.Answer>
                        <TextField
                            data-cy="input-description"
                            name="description"
                            label="Tittel"
                            type="text"
                            // htmlSize={50}
                            value={inputDescription}
                            onChange={(e) => setInputDescription(e.target.value)}
                            error={errors.description}
                        />
                    </FormSummary.Answer>

                    <FormSummary.Answer>
                        <Textarea
                            data-cy="input-detailedInfo"
                            name="detailedInfo"
                            label="Beskrivelse"
                            value={inputDetailedInfo}
                            onChange={(e) => setInputDetailedInfo(e.target.value)}
                            error={errors.detailedInfo}
                        />
                    </FormSummary.Answer>
                    <HStack gap="4">
                        <Button title="Opprett" onClick={handleSubmit} data-cy="save-button">
                            Opprett
                        </Button>
                        <Button variant="secondary" onClick={onCancel}>
                            Avbryt
                        </Button>
                    </HStack>
                </FormSummary.Answers>
            </FormSummary>
        </Box>
    );
}
