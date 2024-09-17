// CreateForm.tsx
import { Form, useActionData } from '@remix-run/react';
import { Button, FormSummary, HStack, TextField, VStack } from '@navikt/ds-react';

interface ActionData {
    errors?: {
        name?: string;
        description?: string;
    };
}

export default function CreateForm({ onCancel }: { onCancel: () => void }) {
    const actionData = useActionData<ActionData>();

    return (
        <Form method="post">
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
                                name="name"
                                label="Navn"
                                type="text"
                                htmlSize={20}
                                error={actionData?.errors?.name}
                            />
                            <span className="pb-3.5">_fintlabs_no</span>
                        </HStack>
                    </FormSummary.Answer>

                    <FormSummary.Answer>
                        <TextField
                            name="description"
                            label="Tittel"
                            type="text"
                            htmlSize={50}
                            error={actionData?.errors?.description}
                        />
                    </FormSummary.Answer>

                    <HStack gap="2">
                        <Button type="submit" title="Opprett">
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
