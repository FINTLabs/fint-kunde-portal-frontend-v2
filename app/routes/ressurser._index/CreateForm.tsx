// CreateForm.tsx
import { BodyShort, Box, Button, Fieldset, HStack, TextField } from '@navikt/ds-react';
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
        <Box paddingBlock="space-16" paddingInline="space-20" data-cy="create-form">
            <Fieldset legend="Opprett ny ressurs">
                <HStack className="flex items-end!" gap="space-2">
                    <TextField
                        data-cy="input-name"
                        name="inputname"
                        label="Navn"
                        type="text"
                        htmlSize={20}
                        error={errors?.name}
                        onChange={(e) => setInputName(e.target.value)}
                    />
                    <BodyShort className={!errors.name ? 'pt-6' : undefined}>
                        {primaryAsset.assetId}
                    </BodyShort>
                </HStack>

                <TextField
                    data-cy="input-description"
                    name="description"
                    label="Tittel"
                    type="text"
                    htmlSize={50}
                    error={errors?.description}
                    onChange={(e) => setInputDescription(e.target.value)}
                />

                <HStack gap="space-2">
                    <Button title="Opprett" data-cy="save-button" onClick={handleSubmit}>
                        Opprett
                    </Button>
                    <Button variant="secondary" onClick={onCancel} data-cy="cancel-button">
                        Avbryt
                    </Button>
                </HStack>
            </Fieldset>
        </Box>
    );
}
