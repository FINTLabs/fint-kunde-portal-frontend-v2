import { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowsSquarepathIcon, EraserIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Switch } from '@navikt/ds-react';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import React, { useEffect } from 'react';
import { IFetcherResponseData } from '~/types/types';
import RelationTestAddForm from '~/routes/relasjonstest/RelationTestAddForm';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import ClientApi from '~/api/ClientApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import LinkWalkerApi from '~/api/LinkWalkerApi';
import RelationTestResultsTable from '~/routes/relasjonstest/RelationTestResultsTable';
import useAlerts from '~/components/useAlerts';
import AlertManager from '~/components/AlertManager';

export const meta: MetaFunction = () => {
    return [{ title: 'Relasjonstest' }, { name: 'description', content: 'Relasjonstest' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(orgName);
    const clients = await ClientApi.getClients(orgName);
    const configs = await ComponentConfigApi.getComponentConfigs();
    const relationTests = await LinkWalkerApi.getTests(orgName);

    return json({ components, clients, relationTests, configs });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Relasjonstest', link: '/relasjonstest' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const { components, clients, relationTests, configs } = useLoaderData<typeof loader>();
    const [autoRefresh, setAutoRefresh] = React.useState(false);
    const { alerts, addAlert, removeAlert } = useAlerts(actionData, fetcher.state);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (autoRefresh) {
            interval = setInterval(() => {
                fetcher.load('/relasjonstest'); // Trigger the loader to refresh the data
            }, 15000);
        }
        console.log('refreshing page', fetcher.state);
        return () => clearInterval(interval);
    }, [autoRefresh, fetcher]);

    function runTest(testUrl: string, client: string) {
        fetcher.submit(
            {
                testUrl: testUrl,
                clientName: client,
                actionType: 'ADD_TEST',
            },
            { method: 'post', action: `/relasjonstest/` }
        );

        // const updatedFormData = { ...formData, actionType: 'runTest' };
        // fetcher.submit(updatedFormData, { method: 'post', action: '/relasjonstest' });
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

            <Box className="w-full" padding="6">
                <HStack gap={'10'}>
                    <Button
                        size={'xsmall'}
                        variant={'secondary'}
                        icon={<EraserIcon aria-hidden />}
                        onClick={removeAllTests}>
                        Fjern alle tester
                    </Button>
                    <Switch
                        checked={autoRefresh}
                        onChange={() => setAutoRefresh(!autoRefresh)}
                        size="small">
                        Auto Refresh
                    </Switch>
                </HStack>
            </Box>

            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                <RelationTestResultsTable logResults={relationTests} />
            </Box>
        </>
    );
}
export async function action({ request }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();
    const testUrl = formData.get('testUrl');
    const clientName = formData.get('clientName');

    const actionType = formData.get('actionType') as string;
    let response;
    switch (actionType) {
        case 'ADD_TEST':
            response = await LinkWalkerApi.addTest(
                testUrl as string,
                clientName as string,
                orgName
            );

            if (response.id) {
                return json({
                    message: `Ny relasjonstest lagt til: ${response.id}`,
                    variant: 'success',
                    show: true,
                });
            } else {
                return json({
                    message: `Feil ved kjører testen. `,
                    variant: 'error',
                    show: true,
                });
            }
        case 'CLEAR_TESTS':
            response = await LinkWalkerApi.clearTests(orgName);

            if (response.ok) {
                return json({
                    message: 'Alle tester fjernet',
                    variant: 'warning',
                    show: true,
                });
            } else {
                return json({
                    message: `Feil ved fjern alle tester. `,
                    variant: 'error',
                    show: true,
                });
            }
    }
}
