import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import { Alert, Box, Loader, VStack } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import BasicTestAddForm from '~/routes/basistest/BasicTestAddForm';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import BasicTestApi from '~/api/BasicTestApi';
import HealthTestResultsTable from '~/routes/basistest/HealthTestResultsTable';
import CacheStatusTable from '~/routes/basistest/CacheStatusTable';
import logger from '~/utils/logger';
import { IFetcherResponseData } from '~/types/FetcherResponseData';

export const meta: MetaFunction = () => {
    return [{ title: 'Basis Test' }, { name: 'description', content: 'Run Basis Test' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(selectOrg);
    const clients = await ClientApi.getClients(selectOrg);

    return new Response(
        JSON.stringify({
            components: components.data,
            clients: clients.data,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

export default function Index() {
    const breadcrumbs = [{ name: 'Basistest', link: '/basistest' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;

    const { components, clients } = useLoaderData<{
        components: IComponent[];
        clients: IClient[];
    }>();

    const handleSearchSubmit = (baseUrl: string, endpoint: string, clientName: string) => {
        const formData = new FormData();
        formData.append('baseUrl', baseUrl);
        formData.append('endpoint', endpoint);
        formData.append('clientName', clientName);
        fetcher.submit(formData, { method: 'post' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Basistest'} icon={TerminalIcon} helpText="basistest" />
            <VStack gap={'6'}>
                <Alert variant="warning">
                    Advarsel: Passordet til klienten du kjører testen på, vil bli nullstilt under
                    testkjøringen. Det anbefales derfor å bruke en dedikert klient for testing.
                </Alert>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <BasicTestAddForm
                        components={components}
                        clients={clients}
                        onSearchSubmit={handleSearchSubmit}
                    />
                </Box>
                {fetcher.state === 'submitting' && (
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <Loader size="large" title="Laster inn data..." />
                    </Box>
                )}
                {fetcher.state !== 'submitting' && (
                    <>
                        {actionData && (
                            <>
                                {actionData.message && (
                                    <Box
                                        className="w-full"
                                        padding="6"
                                        borderRadius="large"
                                        shadow="small">
                                        <Alert variant="info">{actionData.message}</Alert>
                                    </Box>
                                )}

                                {actionData.data.healthData.healthData && (
                                    <Box
                                        className="w-full"
                                        padding="6"
                                        borderRadius="large"
                                        shadow="small">
                                        <HealthTestResultsTable
                                            logResults={actionData.data.healthData.healthData}
                                        />
                                    </Box>
                                )}

                                {actionData.data.cacheData.resourceResults && (
                                    <Box
                                        className="w-full"
                                        padding="6"
                                        borderRadius="large"
                                        shadow="small">
                                        <CacheStatusTable
                                            logResults={actionData.data.cacheData.resourceResults}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </>
                )}
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
    const message = 'Testet med: ' + baseUrl + endpoint + ' ' + clientName + ' ' + orgName;

    logger.debug(`BASIS TEST baseurl/endpoint clientName orgname: ${message}`);
    const cacheData = await BasicTestApi.runTest(orgName, baseUrl, endpoint, clientName);
    const healthData = await BasicTestApi.runHealthTest(orgName, baseUrl, endpoint, clientName);

    logger.silly(`cache request data: ${JSON.stringify(cacheData)}`);
    logger.silly(`health request data: ${JSON.stringify(healthData.data)}`);

    return {
        message: message,
        variant: 'info',
        data: {
            healthData: healthData.data || [],
            cacheData: cacheData.data || [],
        },
    };
}
