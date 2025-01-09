import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Heading, Loader, VStack } from '@navikt/ds-react';
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
import React from 'react';

export const meta: MetaFunction = () => {
    return [{ title: 'Basis Test' }, { name: 'description', content: 'Run Basis Test' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(selectOrg);
    const clients = await ClientApi.getClients(selectOrg);

    const filteredClients = (clients?.data ?? []).filter((client: IClient) => !client.managed);

    return new Response(
        JSON.stringify({
            components: components.data,
            clients: filteredClients,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

type ExtendedFetcherResponseData = IFetcherResponseData & {
    clientName: string;
    testUrl: string;
};

export default function Index() {
    const breadcrumbs = [{ name: 'Basistest', link: '/basistest' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as ExtendedFetcherResponseData;

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
                {fetcher.state !== 'submitting' && !actionData && (
                    <Alert variant="warning">
                        Advarsel: Passordet til klienten du kjører testen på, vil bli nullstilt
                        under testkjøringen. Det anbefales derfor å bruke en dedikert klient for
                        testing.
                    </Alert>
                )}
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <BasicTestAddForm
                        components={components}
                        clients={clients}
                        onSearchSubmit={handleSearchSubmit}
                    />
                </Box>

                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    {fetcher.state === 'submitting' && (
                        <Loader size="large" title="Laster inn data..." />
                    )}

                    {fetcher.state !== 'submitting' && (
                        <>
                            {actionData && (
                                <>
                                    {actionData.message && (
                                        <Box className={'pb-10'}>
                                            <Alert variant="info">
                                                <BodyShort>
                                                    {actionData.message}: {actionData.testUrl}
                                                </BodyShort>
                                                <BodyShort>
                                                    Bruker: {actionData.clientName}
                                                </BodyShort>
                                            </Alert>
                                        </Box>
                                    )}

                                    <Heading size={'medium'}>Resultat av helsetest: </Heading>
                                    {actionData.data.healthData.healthData && (
                                        <HealthTestResultsTable
                                            logResults={actionData.data.healthData.healthData}
                                        />
                                    )}

                                    <Heading size={'medium'} className={'pt-5'}>
                                        Cache status:{' '}
                                    </Heading>
                                    {actionData.data.cacheData.resourceResults && (
                                        <CacheStatusTable
                                            logResults={actionData.data.cacheData.resourceResults}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Box>
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

    const message = 'Testet av: ';

    //Test av: https://beta.felleskomponent.no/utdanning/elev
    // Bruker: basistest@client.fintlabs.no

    logger.debug(`BASIS TEST baseurl/endpoint clientName orgname: ${baseUrl}`);
    const cacheData = await BasicTestApi.runTest(orgName, baseUrl, endpoint, clientName);
    const healthData = await BasicTestApi.runHealthTest(orgName, baseUrl, endpoint, clientName);

    logger.silly(`cache request data: ${JSON.stringify(cacheData)}`);
    logger.silly(`health request data: ${JSON.stringify(healthData.data)}`);

    return {
        message: message,
        clientName: clientName,
        testUrl: baseUrl + endpoint,
        variant: 'info',
        data: {
            healthData: healthData.data || [],
            cacheData: cacheData.data || [],
        },
    };
}
