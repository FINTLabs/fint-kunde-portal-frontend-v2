import {
    type LoaderFunctionArgs,
    json,
    type MetaFunction,
    type ActionFunctionArgs,
} from '@remix-run/node';
import { Box } from '@navikt/ds-react';
import React from 'react';
import Breadcrumbs from '~/components/shared/breadcrumbs';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    console.log('Am in create');
    // const session = await getSession(request.headers.get('Cookie'));
    // const userSession: UserSession | undefined = session.get('user-session');
    // if (!userSession) {
    //     throw new Response('Unauthorized', { status: 401 });
    // }
    return json({});
};

export const meta: MetaFunction = () => {
    return [
        { title: 'Opprett ny ressurs' },
        { name: 'description', content: 'Opprett ny ressurs' },
    ];
};

export default function Index() {
    const breadcrumbs = [
        { name: 'Ressurser', link: '/ressurser' },
        { name: `Opprett ny ressurser`, link: `/ressurser/create` },
    ];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Box paddingBlock="10" paddingInline="20">
                {/* <Form method="post">
                    <FormSummary>
                        <FormSummary.Header>
                            <FormSummary.Heading level="2">Opprett ny adapter</FormSummary.Heading>
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
                </Form> */}
            </Box>
        </>
    );
}

// export async function action({ request }: ActionFunctionArgs) {
//     const formData = await request.formData();

//     const name = formData.get('name') as string;
//     const description = formData.get('description') as string;
//     const detailedInfo = formData.get('detailedInfo') as string;
//     // validate form here // use data mutations with form
//     if (!name || !description || !detailedInfo) {
//         return json({ error: 'Form is not valid' });
//     }

//     const session = await getSession(request.headers.get('Cookie'));
//     const userSession = session.get('user-session');

//     const newAdapter: IPartialAdapter = {
//         name: name,
//         shortDescription: description,
//         note: detailedInfo,
//     };
//     const response = await AdapterAPI.createAdapter(
//         newAdapter,
//         userSession.selectedOrganization.name
//     );

//     if (response.status === 201) {
//         const newAdapter = (await response.json()) as IAdapter;
//         return redirect(`/adapter/${newAdapter.name}`);
//     } else {
//         const responseData = await response.json();
//         return json({
//             error: `Unable to create adapter: ${responseData.error}`,
//             status: response.status,
//         });
//     }
// }