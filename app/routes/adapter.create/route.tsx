import { type ActionFunctionArgs, json, type MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Form, redirect, useActionData } from '@remix-run/react';
import { IPartialAdapter } from '~/types/types';
import { Box, Button, FormSummary, HStack, Textarea, TextField } from '@navikt/ds-react';
import AdapterAPI from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const meta: MetaFunction = () => {
    return [
        { title: 'Opprett ny adapter' },
        { name: 'description', content: 'Opprett ny adapter' },
    ];
};
type Errors = { name?: string; description?: string; detailedInfo?: string };
type ActionData = {
    errors?: Errors;
};

export default function Index() {
    const actionData = useActionData<ActionData>();

    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `Opprett ny adapter`, link: `/adapter/create` },
    ];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Box paddingBlock="10" paddingInline="20">
                <Form method="post">
                    <FormSummary>
                        <FormSummary.Header>
                            <FormSummary.Heading level="2">Opprett ny adapter</FormSummary.Heading>
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
                                    <span className="pb-3.5">@adapter.fintlabs.no</span>
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
                                    name="detailedInfo"
                                    label="Detaljert informasjon"
                                    error={actionData?.errors?.detailedInfo}
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
    const detailedInfo = formData.get('detailedInfo') as string;

    const errors: Errors = {};
    if (!name) errors.name = 'Navn er påkrevd';
    if (!description) errors.description = 'Beskrivelse er påkrevd';
    if (!detailedInfo) errors.detailedInfo = 'Detaljert informasjon er påkrevd';

    if (Object.keys(errors).length > 0) {
        return json({ errors });
    }

    const orgName = await getSelectedOrganization(request);
    const newAdapter: IPartialAdapter = {
        name: name,
        shortDescription: description,
        note: detailedInfo,
    };
    const response = await AdapterAPI.createAdapter(newAdapter, orgName);

    if (response.name) {
        return redirect(`/adapter/${response.name}`);
    } else {
        const responseData = await response.json();
        return json({
            error: `Unable to create adapter: ${responseData.error}`,
            status: response.status,
        });
    }
}
