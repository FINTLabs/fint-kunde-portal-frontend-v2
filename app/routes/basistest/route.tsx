import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, VStack } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import BasicTestAddForm from '~/routes/basistest/BasicTestAddForm';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import { IBasicTestResult } from '~/types/BasicTest';
import BasicTestApi from '~/api/BasicTestApi';
import { handleApiResponse } from '~/utils/handleApiResponse';
import HealthTestResultsTable from '~/routes/basistest/HealthTestResultsTable';
import CacheStatusTable from '~/routes/basistest/CacheStatusTable';

interface ActionData {
    message: string;
    healthMessage?: string;
    variant?: string;
    data: IBasicTestResult[];
    healthTestData?: IBasicTestResult[];
    cacheStatusData?: IBasicTestResult[];
}

export const meta: MetaFunction = () => {
    return [{ title: 'Basis Test' }, { name: 'description', content: 'Run Basis Test' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(selectOrg);
    const clients = await ClientApi.getClients(selectOrg);

    const sortedComponents = components.sort((a: IComponent, b: IComponent) =>
        a.name.localeCompare(b.name)
    );
    const sortedClients = clients.sort((a: IClient, b: IClient) => a.name.localeCompare(b.name));

    return json({ components: sortedComponents, clients: sortedClients });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Basistest', link: '/basistest' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as ActionData;

    const { components, clients } = useLoaderData<{
        components: IComponent[];
        clients: IClient[];
    }>();

    const onSearchSubmit = (baseUrl: string, endpoint: string, clientName: string) => {
        console.debug('...........onSearchSubmit', baseUrl, endpoint, clientName);

        // const formData = new FormData();
        // formData.append('environment', env);
        // formData.append('component', component);
        // formData.append('client', client);
        fetcher.submit(
            {
                baseUrl: baseUrl,
                endpoint: endpoint,
                clientName: clientName,
            },
            { method: 'post', action: `/basistest/` }
        );
        // fetcher.submit(formData, { method: 'post', action: '/basistest' });
    };
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Basistest'} icon={TerminalIcon} helpText="basistest" />
            <VStack gap={'6'}>
                <Alert variant="warning">
                    Advarsel - Passordet på klienten du kjører test på kommer til å bli nullstilt
                    når du kjører en test. Bruk av en dedikert klient for testing anbefales.
                </Alert>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <BasicTestAddForm
                        components={components}
                        clients={clients}
                        onSearchSubmit={onSearchSubmit}
                    />
                </Box>
                {actionData ? (
                    <>
                        {actionData.message && (
                            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                                <Alert variant="info">{actionData.message}</Alert>
                            </Box>
                        )}

                        {actionData.healthTestData && actionData.healthTestData.length > 0 && (
                            <>
                                <Box
                                    className="w-full"
                                    padding="6"
                                    borderRadius="large"
                                    shadow="small">
                                    <HealthTestResultsTable
                                        logResults={actionData.healthTestData}
                                    />
                                </Box>
                            </>
                        )}

                        {actionData.cacheStatusData && actionData.cacheStatusData.length > 0 && (
                            <>
                                <Box
                                    className="w-full"
                                    padding="6"
                                    borderRadius="large"
                                    shadow="small">
                                    <CacheStatusTable logResults={actionData.cacheStatusData} />
                                </Box>
                            </>
                        )}
                    </>
                ) : (
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <BodyShort>Bruk skjemaet for å lage en rapport</BodyShort>
                    </Box>
                )}{' '}
            </VStack>
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const baseUrl = formData.get('baseUrl') as string;
    const endpoint = formData.get('endpoint') as string;
    const clientName = formData.get('clientName') as string;

    const orgName = await getSelectedOrganization(request);

    const message = 'Run test with: ' + baseUrl + ' ' + endpoint + ' ' + clientName + ' ' + orgName;

    let apiResponse;
    let healthResponse;
    let response;

    try {
        // Run the first test
        apiResponse = await BasicTestApi.runTest(orgName, baseUrl, endpoint, clientName);

        // Run the second test (health check)
        healthResponse = await BasicTestApi.runHealthTest(orgName, baseUrl, endpoint, clientName);

        // Handle responses
        const testResponse = handleApiResponse(apiResponse, message);
        const healthTestResponse = handleApiResponse(healthResponse, 'Health test completed');

        // Combine the data from both responses
        response = {
            testMessage: testResponse?.message,
            healthTestMessage: healthTestResponse?.message,
            variant: testResponse?.variant || healthTestResponse?.variant, // pick a variant from either response
        };
    } catch (error) {
        console.error('Error running tests:', error);
        throw new Response('Error loading data.', { status: 404 });
    }

    console.log('--------', message);

    // Return both the first and second API results in the JSON response
    return json({
        show: true,
        message: response.testMessage,
        healthMessage: response.healthTestMessage,
        variant: response.variant,
    });
}
