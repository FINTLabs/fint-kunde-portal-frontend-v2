import { LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Alert, Box, VStack } from '@navikt/ds-react';
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

export const meta: MetaFunction = () => {
    return [{ title: 'Relasjonstest' }, { name: 'description', content: 'Relasjonstest' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(orgName);
    const clients = await ClientApi.getClients(orgName);
    const configs = await ComponentConfigApi.getComponentConfigs();
    const relationTests = await LinkWalkerApi.getTests(orgName);

    return json({ components, clients, relationTests, configs, orgName });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Relasjonstest', link: '/relasjonstest' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);
    const { components, clients, relationTests, configs, orgName } = useLoaderData<typeof loader>();

    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    function runTest() {}

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Relasjonstest'}
                icon={ArrowsSquarepathIcon}
                helpText="relasjonstest"
            />
            <VStack gap={'6'}>
                {actionData && show && (
                    <Alert
                        className={'!mt-5'}
                        variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                        closeButton
                        onClose={() => setShow(false)}>
                        {actionData.message || 'Content'}
                    </Alert>
                )}
            </VStack>

            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                <RelationTestAddForm
                    components={components}
                    clients={clients}
                    configs={configs}
                    runTest={runTest}
                />
            </Box>

            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                <RelationTestResultsTable logResults={relationTests} orgName={orgName} />
            </Box>
        </>
    );
}
