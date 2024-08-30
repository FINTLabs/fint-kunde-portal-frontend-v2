import { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
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
import { error } from '~/utils/logger';
import AccessApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import LinkWalkerApi from '~/api/LinkWalkerApi';
import { IRelationTest } from '~/types/RelationTest';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    error('testing errors');
    try {
        const components = await ComponentApi.getOrganisationComponents(orgName);
        const clients = await ClientApi.getClients(orgName);
        const assets = await AccessApi.getAllAssets(orgName);
        const relationTests = await LinkWalkerApi.getTests(orgName);

        return json({ components, clients, assets, relationTests });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    console.log('INSIDE ACTION -------------------------->', actionType);
    let response;
    switch (actionType) {
        case 'runTest':
            response = await LinkWalkerApi.addTest(orgName, orgName);
            break;
        default:
            return json({ show: true, message: 'Unknown action type', variant: 'error' });
    }

    return json({ show: true, message: response?.message, variant: response?.variant });
}
export default function Index() {
    const breadcrumbs = [{ name: 'Relasjonstest', link: '/relasjonstest' }];
    const fetcher = useFetcher();
    // const actionData = fetcher.data as ActionData;

    const { components, clients, assets, relationTests } = useLoaderData<{
        components: IComponent[];
        clients: IClient[];
        assets: IAsset[];
        relationTests: IRelationTest[];
    }>();

    function runTest(formData: { testString: string }) {
        error('running a test?');
        const updatedFormData = { ...formData, actionType: 'runTest' };
        fetcher.submit(updatedFormData, { method: 'post', action: '/relasjonstest' });
    }

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
                    <RelationTestAddForm
                        components={components}
                        clients={clients}
                        assets={assets}
                        runTest={runTest}
                    />
                </Box>

                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    {relationTests.length}
                    {/*<RelationTestResultsTable logResults={actionData.data} />*/}
                </Box>
            </VStack>
        </>
    );
}
