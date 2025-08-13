// CreateForm.tsx
import { useActionData } from 'react-router';
import { Box, Button, FormSummary, HStack, TextField } from '@navikt/ds-react';

interface ActionData {
    errors?: {
        name?: string;
        description?: string;
    };
}

export default function CreateForm({
    onCancel,
    orgName,
}: {
    onCancel: () => void;
    orgName: string;
}) {
    const actionData = useActionData<ActionData>();

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
                                name="name"
                                label="Navn"
                                type="text"
                                htmlSize={20}
                                error={actionData?.errors?.name}
                            />
                            <span className="pb-3.5">_{orgName}</span>
                        </HStack>
                    </FormSummary.Answer>

                    <FormSummary.Answer>
                        <TextField
                            data-cy="input-description"
                            name="description"
                            label="Tittel"
                            type="text"
                            htmlSize={50}
                            error={actionData?.errors?.description}
                        />
                    </FormSummary.Answer>

                    <HStack gap="2">
                        <Button type="submit" title="Opprett" data-cy="save-button">
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
