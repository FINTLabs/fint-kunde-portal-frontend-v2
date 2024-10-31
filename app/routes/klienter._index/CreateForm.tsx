import { Button, FormSummary, HStack, Textarea, TextField } from '@navikt/ds-react';
import { Form } from '@remix-run/react';
import React, { useState } from 'react';

interface AdapterCreateFormProps {
    onCancel: () => void;
    onSave: (formData: FormData) => void;
    orgName: string;
}
type Errors = { name?: string; description?: string; note?: string };

export default function ClientCreateForm({ onCancel, onSave, orgName }: AdapterCreateFormProps) {
    const [errors, setErrors] = useState<Errors>({});
    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputNote, setInputNote] = useState('');

    const handleSubmit = () => {
        const newErrors: Errors = {};
        if (!inputName) {
            newErrors.name = 'Navn er påkrevd';
        }
        if (!inputDescription) {
            newErrors.description = 'Tittel er påkrevd';
        }
        if (!inputNote) {
            newErrors.note = 'Detaljert informasjon er påkrevd';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', inputName);
            formData.append('description', inputDescription);
            formData.append('note', inputNote);
            onSave(formData);
        }
    };

    return (
        <Form method="post">
            <FormSummary>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">Opprett ny klient</FormSummary.Heading>
                    {/* <FormSummary.EditLink href="#" /> */}
                </FormSummary.Header>

                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <HStack className="flex !items-end" gap="2">
                            <TextField
                                name="name"
                                label="Navn"
                                type="text"
                                htmlSize={20}
                                error={errors?.name}
                                onChange={(e) => setInputName(e.target.value)}
                            />
                            <span className="pb-3.5">@client.{orgName.replace(/_/g, '.')}</span>
                        </HStack>
                    </FormSummary.Answer>

                    <FormSummary.Answer>
                        <TextField
                            name="description"
                            label="Tittel"
                            type="text"
                            htmlSize={50}
                            error={errors?.description}
                            onChange={(e) => setInputDescription(e.target.value)}
                        />
                    </FormSummary.Answer>

                    <FormSummary.Answer>
                        <Textarea
                            name="note"
                            label="Beskrivelse"
                            error={errors?.note}
                            onChange={(e) => setInputNote(e.target.value)}
                        />
                    </FormSummary.Answer>
                    <HStack gap="4">
                        <Button title="Opprett" onClick={handleSubmit}>
                            Opprett
                        </Button>
                        <Button variant="secondary" onClick={onCancel}>
                            Avbryt
                        </Button>
                    </HStack>
                </FormSummary.Answers>
            </FormSummary>
        </Form>
    );
}
