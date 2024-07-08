import {
    type LoaderFunctionArgs,
    json,
    type LoaderFunction,
    type MetaFunction,
    type ActionFunctionArgs,
} from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { Form, useLoaderData, useParams } from '@remix-run/react';
import adapters from '~/routes/adaptere/adapterList.json';
import { IAdapter, IPartialAdapter, IUserSession } from '~/types/types';
import { getSession } from '~/utils/session';
import { ErrorBox } from '~/components/shared/ErrorBox';
import { Box, Button, FormSummary, HStack, TextField, Textarea } from '@navikt/ds-react';
import AdapterAPI from '~/api/AdapterApi';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    console.log('Am in loader');
    // const session = await getSession(request.headers.get('Cookie'));
    // const userSession: UserSession | undefined = session.get('user-session');
    // if (!userSession) {
    //     throw new Response('Unauthorized', { status: 401 });
    // }
    return json({});
};

export const meta: MetaFunction = () => {
    return [
        { title: 'Opprett ny adapter' },
        { name: 'description', content: 'Opprett ny adapter' },
    ];
};

export default function Index() {
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
                                    <TextField name="name" label="Navn" type="text" htmlSize={20} />
                                    <span className="pb-3.5">@adapter.fintlabs.no</span>
                                </HStack>
                            </FormSummary.Answer>

                            <FormSummary.Answer>
                                <TextField
                                    name="description"
                                    label="Kort beskrivelse"
                                    type="text"
                                    htmlSize={50}
                                />
                            </FormSummary.Answer>

                            <FormSummary.Answer>
                                <Textarea name="detailedInfo" label="Detaljert informasjon" />
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

    // create adapter based on formaData;

    console.log('formData');
    console.log(formData);
    console.log(formData.get('name'));
    console.log(formData.get('description'));
    console.log(formData.get('detailedInfo'));

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const detailedInfo = formData.get('detailedInfo') as string;
    // validate form here // use data mutations with form
    if (!name || !description || !detailedInfo) {
        return json({ error: 'Form is not valid' });
    }

    const session = await getSession(request.headers.get('Cookie'));
    const userSession = session.get('user-session');

    const newAdapter: IPartialAdapter = {
        name: name,
        shortDescription: description,
        note: detailedInfo,
    };
    const response = await AdapterAPI.createAdapter(
        newAdapter,
        userSession.selectedOrganization.name
    );
    // check if user was created successfully
    return json({ ok: true });
}
