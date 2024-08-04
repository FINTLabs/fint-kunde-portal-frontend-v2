import {
    type LoaderFunctionArgs,
    json,
    type MetaFunction,
    type ActionFunctionArgs,
    redirect,
} from '@remix-run/node';
import { Box, Button, FormSummary, HStack, Textarea, TextField } from '@navikt/ds-react';
import React from 'react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Form, useActionData } from '@remix-run/react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IAsset, IPartialAsset } from '~/types/Asset';
import AssetApi from '~/api/AssetApi';

export const meta: MetaFunction = () => {
    return [
        { title: 'Opprett ny ressurs' },
        { name: 'description', content: 'Opprett ny ressurs' },
    ];
};

type Errors = { name?: string; description?: string; apiError?: string };
type ActionData = {
    errors?: Errors;
};

export default function Index() {
    const actionData = useActionData<ActionData>();

    const breadcrumbs = [
        { name: 'Ressurser', link: '/ressurser' },
        { name: `Opprett ny ressurs`, link: `/ressurser/create` },
    ];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Box paddingBlock="10" paddingInline="20">
                <Form method="post">
                    <FormSummary>
                        <FormSummary.Header>
                            <FormSummary.Heading level="2">Opprett ny ressurs</FormSummary.Heading>
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
                                    label="Kort beskrivelse"
                                    type="text"
                                    htmlSize={50}
                                    error={actionData?.errors?.description}
                                />
                            </FormSummary.Answer>

                            <Button type="submit" title="Opprett">
                                Opprett
                            </Button>
                        </FormSummary.Answers>
                    </FormSummary>
                </Form>

                {actionData?.errors?.apiError && (
                    <Box padding="4" background="surface-danger-subtle">
                        {actionData.errors.apiError}
                    </Box>
                )}
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

    if (Object.keys(errors).length > 0) {
        return json({ errors });
    }

    const orgName = await getSelectedOrganization(request);
    const newAsset: IPartialAsset = {
        assetId: name,
        name: name,
        description,
    };
    console.log(newAsset);
    const response = await AssetApi.createAsset(newAsset, orgName);

    console.log(response);
    if (response.status === 201) {
        // const newAdapter = (await response.json()) as IAsset;
        return redirect(`/ressurser/${newAsset.assetId}_fintlabs_no`);
    } else {
        return json({
            errors: {
                apiError: `Unable to create resource: Status: ${response.status}, statusText: ${response.statusText}`,
            },
            status: response.status,
        });
    }
}
