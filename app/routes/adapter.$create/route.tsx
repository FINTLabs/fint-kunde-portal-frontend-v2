import {
    type LoaderFunctionArgs,
    json,
    type LoaderFunction,
    type MetaFunction,
} from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { useLoaderData, useParams } from '@remix-run/react';
import adapters from '~/routes/adaptere/adapterList.json';
import { UserSession } from '~/types/types';
import { getSession } from '~/utils/session';
import { ErrorBox } from '~/components/shared/ErrorBox';
import { Box, FormSummary, HStack, TextField, Textarea } from '@navikt/ds-react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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
            {/* <InternalPageHeader
                title={'Opprett ny adapter'}
                icon={MigrationIcon}
                helpText="adapter detaljer"
                hideBorder={true}
            /> */}
            <Box paddingBlock="10" paddingInline="20">
                <FormSummary>
                    <FormSummary.Header>
                        <FormSummary.Heading level="2">Opprett ny adapter</FormSummary.Heading>
                        {/* <FormSummary.EditLink href="#" /> */}
                    </FormSummary.Header>

                    <FormSummary.Answers>
                        <FormSummary.Answer>
                            <HStack className="flex !items-end" gap="2">
                                <TextField label="Navn" htmlSize={20} />
                                <span className="pb-3.5">@adapter.fintlabs.no</span>
                            </HStack>
                        </FormSummary.Answer>

                        <FormSummary.Answer>
                            <TextField label="Kort beskrivelse" htmlSize={50} />
                        </FormSummary.Answer>

                        <FormSummary.Answer>
                            <Textarea label="Detaljert informasjon" />
                        </FormSummary.Answer>
                    </FormSummary.Answers>
                </FormSummary>
            </Box>
        </>
    );
}
