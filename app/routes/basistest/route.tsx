import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Loader, VStack } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import BasicTestAddForm from '~/routes/basistest/BasicTestAddForm';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import { IBasicTestResult, IHealthTestResult } from '~/types/BasicTest';
import BasicTestApi from '~/api/BasicTestApi';
import HealthTestResultsTable from '~/routes/basistest/HealthTestResultsTable';
import CacheStatusTable from '~/routes/basistest/CacheStatusTable';
import logger from '~/utils/logger';
import { IFetcherResponseData } from '~/types/FetcherResponseData';

export const meta: MetaFunction = () => {
    return [{ title: 'Basis Test' }, { name: 'description', content: 'Run Basis Test' }];
};

interface IExtendedFetcherResponseData extends IFetcherResponseData {
    healthTestData?: IHealthTestResult[];
    cacheStatusData?: IBasicTestResult[];
}

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
    const actionData = fetcher.data as IExtendedFetcherResponseData;

    const { components, clients } = useLoaderData<{
        components: IComponent[];
        clients: IClient[];
    }>();

    const onSearchSubmit = (baseUrl: string, endpoint: string, clientName: string) => {
        fetcher.submit(
            {
                baseUrl: baseUrl,
                endpoint: endpoint,
                clientName: clientName,
            },
            { method: 'post', action: `/basistest/` }
        );
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
                {fetcher.state === 'submitting' && (
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <Loader size="large" title="Laster inn data..." />
                    </Box>
                )}
                {fetcher.state !== 'submitting' && (
                    <>
                        {actionData ? (
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

                                {actionData.healthTestData &&
                                    actionData.healthTestData.length > 0 && (
                                        <Box
                                            className="w-full"
                                            padding="6"
                                            borderRadius="large"
                                            shadow="small">
                                            <HealthTestResultsTable
                                                logResults={actionData.healthTestData}
                                            />
                                        </Box>
                                    )}

                                {actionData.cacheStatusData &&
                                    actionData.cacheStatusData.length > 0 && (
                                        <Box
                                            className="w-full"
                                            padding="6"
                                            borderRadius="large"
                                            shadow="small">
                                            <CacheStatusTable
                                                logResults={actionData.cacheStatusData}
                                            />
                                        </Box>
                                    )}
                            </>
                        ) : (
                            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                                <BodyShort>Bruk skjemaet for å lage en rapport</BodyShort>
                            </Box>
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
    const message = 'Testet med:: ' + baseUrl + ' ' + endpoint + ' ' + clientName + ' ' + orgName;

    const cacheData = await BasicTestApi.runTest(orgName, baseUrl, endpoint, clientName);
    const healthData = await BasicTestApi.runHealthTest(orgName, baseUrl, endpoint, clientName);

    logger.silly(`cache request data: ${JSON.stringify(cacheData)}`);
    logger.silly(`health request data: ${JSON.stringify(healthData)}`);

    return {
        message: message,
        variant: 'info',
        healthTestData: healthData.data,
        cacheStatusData: cacheData.data,
    };
}
