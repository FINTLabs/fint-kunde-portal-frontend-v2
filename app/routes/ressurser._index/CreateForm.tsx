// CreateForm.tsx
import { Box, Button, FormSummary, HStack, Label, TextField } from '@navikt/ds-react';
import { useState } from 'react';
import { IAsset } from '~/types';

type Errors = { name?: string; description?: string; note?: string };

export default function CreateForm({
    onCancel,
    onCreate,
    primaryAsset,
}: {
    onCancel: () => void;
    onCreate: (formData: FormData) => void;
    primaryAsset: IAsset;
}) {
    // const actionData = useActionData<ActionData>();

    const [errors, setErrors] = useState<Errors>({});
    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');

    const handleSubmit = () => {
        const newErrors: Errors = {};
        if (!inputName) {
            newErrors.name = 'Navn er påkrevd';
        }
        if (!inputDescription) {
            newErrors.description = 'Tittel er påkrevd';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', inputName);
            formData.append('description', inputDescription);
            formData.append('orgName', primaryAsset.assetId);
            onCreate(formData);
        }
    };

    return (
        <Box paddingBlock="10" paddingInline="20" data-cy="create-form">
            <FormSummary>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">Opprett ny ressurs</FormSummary.Heading>
                    {/* Optional Edit Link */}
                    {/* <FormSummary.EditLink href="#" /> */}
                </FormSummary.Header>

                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <HStack className="flex !items-end" gap="2">
                            <TextField
                                data-cy="input-name"
                                name="inputname"
                                label="Navn"
                                type="text"
                                htmlSize={20}
                                error={errors?.name}
                                onChange={(e) => setInputName(e.target.value)}
                            />
                            <Label>{primaryAsset.assetId}</Label>
                        </HStack>
                    </FormSummary.Answer>

                    <FormSummary.Answer>
                        <TextField
                            data-cy="input-description"
                            name="description"
                            label="Tittel"
                            type="text"
                            htmlSize={50}
                            error={errors?.description}
                            onChange={(e) => setInputDescription(e.target.value)}
                        />
                    </FormSummary.Answer>

                    <HStack gap="2">
                        <Button title="Opprett" data-cy="save-button" onClick={handleSubmit}>
                            Opprett
                        </Button>
                        <Button variant="secondary" onClick={onCancel} data-cy="cancel-button">
                            Avbryt
                        </Button>
                    </HStack>
                </FormSummary.Answers>
            </FormSummary>
        </Box>
    );
}
