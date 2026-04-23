import {
    Box,
    Button,
    FormSummary,
    HStack,
    // LocalAlert,
    Select,
    Textarea,
    TextField,
} from '@navikt/ds-react';
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
        // <Form method="post">
        <Box paddingBlock="space-12">
            <FormSummary>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">Opprett ny klient</FormSummary.Heading>
                    {/* <FormSummary.EditLink href="#" /> */}
                </FormSummary.Header>

                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <HStack gap="space-4" align="center">
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
                            <span className="pb-3.5">@client.{orgName.replace(/_/g, '.')}</span>
                        </HStack>
                    </FormSummary.Answer>

                    <FormSummary.Answer>
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
                    </FormSummary.Answer>

                    <FormSummary.Answer>
                        <Textarea
                            data-cy="input-note"
                            name="note"
                            label="Beskrivelse"
                            error={errors?.note}
                            onChange={(e) => setInputNote(e.target.value)}
                        />
                    </FormSummary.Answer>
                    <FormSummary.Answer>
                        <Select
                            label="Velg modelversjon"
                            size="small"
                            description="Styrer hvilken informasjonsmodellversjon klienten kommuniserer med for utdanningsdomenet"
                            style={{ width: '12rem' }}
                            onChange={(e) => setInputModelVersion(e.target.value)}>
                            <option value="V3">V3</option>
                            <option value="V4">V4</option>
                        </Select>
                    </FormSummary.Answer>
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
                </FormSummary.Answers>
            </FormSummary>
            {/*{alertState.length > 0 && (*/}
            {/*    <LocalAlert status="announcement">*/}
            {/*        <LocalAlert.Header>*/}
            {/*            <LocalAlert.Title>*/}
            {/*                Nyhet! Nå kan du ettersende vedlegg digitalt*/}
            {/*            </LocalAlert.Title>*/}
            {/*        </LocalAlert.Header>*/}
            {/*        <LocalAlert.Content>*/}
            {/*            Kunngjøringer brukes for å formidle noe om appen eller systemet, eller*/}
            {/*            endringer som påvirker brukerne. Eksempelvis planlagt vedlikehold eller*/}
            {/*            driftsmeldinger.*/}
            {/*        </LocalAlert.Content>*/}
            {/*    </LocalAlert>*/}
            {/*)}*/}
        </Box>
        // </Form>
    );
}
