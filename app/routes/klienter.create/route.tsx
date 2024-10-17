import { type ActionFunctionArgs, json, type MetaFunction, redirect } from '@remix-run/node';
import { Box, Button, FormSummary, HStack, Textarea, TextField } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Form, useActionData } from '@remix-run/react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ClientApi from '~/api/ClientApi';
import { IPartialClient } from '~/types/Clients';
import logger from '~/utils/logger';

export const meta: MetaFunction = () => {
    return [{ title: 'Opprett ny klient' }, { name: 'description', content: 'Opprett ny klient' }];
};

type Errors = { name?: string; description?: string; note?: string; apiError?: string };
type ActionData = {
    errors?: Errors;
    status: number;
};

export default function Index() {
    const actionData = useActionData<ActionData>();

    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: `Opprett ny klient`, link: `/klient/create` },
    ];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Box paddingBlock="10" paddingInline="20">
                {actionData?.errors?.apiError && (
                    <Box padding="4" background="surface-danger-subtle">
                        {actionData.errors.apiError}
                    </Box>
                )}
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
                                        error={actionData?.errors?.name}
                                    />
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

                            <FormSummary.Answer>
                                <Textarea
                                    name="note"
                                    label="Beskrivelse"
                                    error={actionData?.errors?.note}
                                />
                            </FormSummary.Answer>
                            <Button type="submit" title="Opprett">
                                Opprett
                            </Button>
                        </FormSummary.Answers>
                    </FormSummary>
                </Form>
            </Box>
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const note = formData.get('note') as string;

    const errors: Errors = {};
    if (!name) errors.name = 'Navn er påkrevd';
    if (!description) errors.description = 'Tittel er påkrevd';
    if (!note) errors.note = 'Beskrivelse er påkrevd';

    if (Object.keys(errors).length > 0) {
        return json({ errors });
    }

    const orgName = await getSelectedOrganization(request);
    const newClient: IPartialClient = {
        name: name,
        note: note,
        shortDescription: description,
    };

    const response = await ClientApi.createClient(newClient, orgName);

    logger.debug(`.... Response Client Create: ${JSON.stringify(response)}`);
    logger.debug('Response client name:', response.name);

    if (response.name) {
        return redirect(`/klienter/${response.name}`);
    } else {
        return json({
            errors: {
                apiError: `Feil oppretting av klient. Responsen inneholder ikke navn.`,
            },
        });
    }
}
