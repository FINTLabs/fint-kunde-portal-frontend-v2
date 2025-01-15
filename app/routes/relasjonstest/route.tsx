import { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowsSquarepathIcon, EraserIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack } from '@navikt/ds-react';
import { useFetcher, useLoaderData } from '@remix-run/react';
import React, { useEffect } from 'react';
import RelationTestAddForm from '~/routes/relasjonstest/RelationTestAddForm';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import ClientApi from '~/api/ClientApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import LinkWalkerApi from '~/api/LinkWalkerApi';
import RelationTestResultsTable from '~/routes/relasjonstest/RelationTestResultsTable';
import useAlerts from '~/components/useAlerts';
import AlertManager from '~/components/AlertManager';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import logger from '~/utils/logger';
import { IClient } from '~/types/Clients';

export const meta: MetaFunction = () => {
    return [{ title: 'Relasjonstest' }, { name: 'description', content: 'Relasjonstest' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(orgName);
    const clients = await ClientApi.getClients(orgName);
    const configs = await ComponentConfigApi.getComponentConfigs();
    const relationTests = await LinkWalkerApi.getTests(orgName);

    const filteredClients = (clients?.data ?? []).filter((client: IClient) => !client.managed);

    // return json({ components, clients, relationTests, configs });
    return new Response(
        JSON.stringify({
            components: components.data,
            clients: filteredClients,
            relationTests: relationTests.data,
            configs: configs.data,
            success: false,
            message: `Oppdatering av testresultater`,
            variant: 'success',
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

export default function Index() {
    const breadcrumbs = [{ name: 'Relasjonstest', link: '/relasjonstest' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const { components, clients, relationTests, configs } = useLoaderData<typeof loader>();
    const { alerts } = useAlerts(actionData, fetcher.state);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (
            relationTests.some((test: { status: string }) =>
                [
                    'STARTED',
                    'FETCHING_RESOURCES',
                    'CREATING_ENTRY_REPORTS',
                    'PROCESSING_LINKS',
                    'COMPLETED',
                    'FAILED',
                    // STARTED,
                    // FETCHING_RESOURCES,
                    // CREATING_ENTRY_REPORTS,
                    // PROCESSING_LINKS,
                    // COMPLETED,
                    // FAILED
                ].includes(test.status)
            )
        ) {
            interval = setInterval(() => {
                fetcher.formData?.set('message', 'test');
                fetcher.load('/relasjonstest');
            }, 15000);
        }

        return () => clearInterval(interval);
    }, [relationTests, fetcher]);

    function runTest(testUrl: string, client: string) {
        const formData = new FormData();
        formData.append('testUrl', testUrl);
        formData.append('clientName', client);
        formData.append('actionType', 'ADD_TEST');
        fetcher.submit(formData, { method: 'post' });
    }

    function removeAllTests() {
        const formData = new FormData();
        formData.append('actionType', 'CLEAR_TESTS');
        fetcher.submit(formData, { method: 'post' });
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Relasjonstest'}
                icon={ArrowsSquarepathIcon}
                helpText="relasjonstest"
            />
            <AlertManager alerts={alerts} />

            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                <RelationTestAddForm
                    components={components}
                    clients={clients}
                    configs={configs}
                    runTest={runTest}
                />
            </Box>

            {relationTests && relationTests.length > 0 && (
                <>
                    <Box className="w-full" padding="6">
                        <HStack gap={'10'}>
                            <Button
                                size={'xsmall'}
                                variant={'secondary'}
                                icon={<EraserIcon aria-hidden />}
                                onClick={removeAllTests}>
                                Fjern alle tester
                            </Button>
                        </HStack>
                    </Box>
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <RelationTestResultsTable logResults={relationTests} />
                    </Box>
                </>
            )}
        </>
    );
}
export async function action({ request }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();
    const testUrl = formData.get('testUrl');
    const clientName = formData.get('clientName');
    const actionType = formData.get('actionType') as string;

    logger.debug('ACTION TYPE relatonstest', actionType);
    let response;

    switch (actionType) {
        case 'ADD_TEST':
            response = await LinkWalkerApi.addTest(
                testUrl as string,
                clientName as string,
                orgName
            );
            break;

        case 'CLEAR_TESTS':
            response = await LinkWalkerApi.clearTests(orgName);
            break;

        default:
            response = {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
            break;
    }

    return response;
}
