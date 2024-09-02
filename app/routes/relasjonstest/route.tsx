import { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Alert, Box, VStack } from '@navikt/ds-react';
import RelationTestAddForm from '~/routes/relasjonstest/RelationTestAddForm';
import ComponentApi from '~/api/ComponentApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { error, log } from '~/utils/logger';
import LinkWalkerApi from '~/api/LinkWalkerApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import React, { useEffect } from 'react';
import { IFetcherResponseData } from '~/types/types';
import RelationTestResultsTable from '~/routes/relasjonstest/RelationTestResultsTable';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    error('testing errors');
    try {
        const components = await ComponentApi.getOrganisationComponents(orgName);
        const clients = await ClientApi.getClients(orgName);
        const relationTests = await LinkWalkerApi.getTests(orgName);
        const configs = await ComponentConfigApi.getComponentConfigs();

        return json({ components, clients, relationTests, configs, orgName });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    log('INSIDE ACTION -------------------------->', actionType);
    let response;
    switch (actionType) {
        case 'runTest':
            log('RUNNING A TEST');
            const testUrl = formData.get('testUrl');
            const clientName = formData.get('clientName');
            response = await LinkWalkerApi.addTest(
                testUrl as string,
                clientName as string,
                orgName
            );
            break;
        default:
            return json({ show: true, message: 'Unknown action type', variant: 'error' });
    }

    return json({ show: true, message: response?.message, variant: response?.variant });
}
export default function Index() {
    const breadcrumbs = [{ name: 'Relasjonstest', link: '/relasjonstest' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);
    const { components, clients, relationTests, configs, orgName } = useLoaderData<typeof loader>();

    function runTest(formData: { testUrl: string; clientName: string }) {
        const updatedFormData = { ...formData, actionType: 'runTest' };
        fetcher.submit(updatedFormData, { method: 'post', action: '/relasjonstest' });
    }
    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Relasjonstest'}
                icon={ArrowsSquarepathIcon}
                helpText="relasjonstest"
            />
            <VStack gap={'6'}>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <RelationTestAddForm
                        components={components}
                        clients={clients}
                        configs={configs}
                        runTest={runTest}
                    />
                </Box>

                {actionData && show && (
                    <Alert
                        className={'!mt-5'}
                        variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                        closeButton
                        onClose={() => setShow(false)}>
                        {actionData.message || 'Content'}
                    </Alert>
                )}

                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <RelationTestResultsTable logResults={relationTests} orgName={orgName} />
                </Box>
            </VStack>
        </>
    );
}
