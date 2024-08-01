import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import { Box, VStack } from '@navikt/ds-react';
import RelationTestAddForm from '~/routes/relasjonstest/RelationTestAddForm';
import ComponentApi from '~/api/ComponentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';

// interface ActionData {
//     message: string;
//     data: any;
// }
export const meta: MetaFunction = () => {
    return [
        { title: 'Relasjonstest' },
        { name: 'description', content: 'Liste over hendelseslogg' },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    try {
        const components = await ComponentApi.getOrganisationComponents(orgName);
        const clients = await ClientApi.getClients(orgName);
        return json({ components, clients });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const fetcher = useFetcher();
    // const actionData = fetcher.data as ActionData;

    const { components, clients } = useLoaderData<{
        components: IComponent[];
        clients: IClient[];
    }>();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Relasjonstest'}
                icon={TerminalIcon}
                helpText="relasjonstest"
            />
            <VStack gap={'6'}>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <RelationTestAddForm f={fetcher} components={components} clients={clients} />
                </Box>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    {/*<RelationTestResultsTable logResults={actionData.data} />*/}
                </Box>
            </VStack>
        </>
    );
}
