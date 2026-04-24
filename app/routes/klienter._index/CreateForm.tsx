import { BodyShort, Button, Fieldset, HStack, Select, Textarea, TextField } from '@navikt/ds-react';
import React, { useState } from 'react';
import AnalyticsApi from '~/api/AnalyticsApi';
import { IClient, IUserSession } from '~/types';
import { useOutletContext } from 'react-router';

interface AdapterCreateFormProps {
    onCancel: () => void;
    onSave: (formData: FormData) => void;
    orgName: string;
    isSubmitting: boolean;
    clientData: IClient[];
}
type Errors = { name?: string; description?: string; note?: string };

export default function ClientCreateForm({
    onCancel,
    onSave,
    orgName,
    isSubmitting,
    clientData,
}: AdapterCreateFormProps) {
    const [errors, setErrors] = useState<Errors>({});
    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputNote, setInputNote] = useState('');
    const [inputModelVersion, setInputModelVersion] = useState('V3');
    const userSession = useOutletContext<IUserSession>();

    const handleSubmit = () => {
        void AnalyticsApi.trackButtonClick(
            'client-create-button',
            '/klienter',
            userSession?.selectedOrganization?.name,
            { inputName: inputName }
        );

        const newErrors: Errors = {};
        if (!inputName) {
            newErrors.name = 'Navn er påkrevd';
        }
        const exists = clientData.some((client) =>
            client.name.toLowerCase().includes(inputName.toLowerCase())
        );
        if (inputName && exists) {
            newErrors.name = 'Klienten eksisterer allerede';
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
            formData.append('modelVersion', inputModelVersion);
            onSave(formData);
        }
    };

    return (
        <Fieldset legend="Opprett ny klient">
            <HStack gap="space-4" align="center" justify="start">
                <TextField
                    data-cy="input-name"
                    name="name"
                    label="Navn"
                    type="text"
                    htmlSize={20}
                    error={errors?.name}
                    size={'small'}
                    onChange={(e) => setInputName(e.target.value)}
                />
                <BodyShort className={!errors.name ? 'pt-6' : undefined}>
                    @client.{orgName.replace(/_/g, '.')}
                </BodyShort>
            </HStack>

            <TextField
                data-cy="input-title"
                name="description"
                label="Tittel"
                type="text"
                htmlSize={50}
                error={errors?.description}
                size={'small'}
                onChange={(e) => setInputDescription(e.target.value)}
            />

            <Textarea
                data-cy="input-note"
                name="note"
                label="Beskrivelse"
                error={errors?.note}
                onChange={(e) => setInputNote(e.target.value)}
            />
            <Select
                label="Velg modelversjon"
                size="small"
                description="Styrer hvilken informasjonsmodellversjon klienten kommuniserer med for utdanningsdomenet"
                style={{ width: '12rem' }}
                onChange={(e) => setInputModelVersion(e.target.value)}>
                <option value="V3">V3</option>
                <option value="V4">V4</option>
            </Select>
            <HStack gap="space-4">
                <Button
                    title="Opprett"
                    onClick={handleSubmit}
                    data-cy="save-button"
                    loading={isSubmitting}>
                    Opprett
                </Button>
                <Button variant="secondary" onClick={onCancel}>
                    Avbryt
                </Button>
            </HStack>
        </Fieldset>
    );
}
