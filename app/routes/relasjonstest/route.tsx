import { ArrowsSquarepathIcon, EraserIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack } from '@navikt/ds-react';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import React, { useEffect } from 'react';
import { type ActionFunctionArgs, type MetaFunction, useFetcher, useLoaderData } from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleRelationTestAction } from '~/routes/relasjonstest/actions';
import RelationTestAddForm from '~/routes/relasjonstest/RelationTestAddForm';
import RelationTestResultsTable from '~/routes/relasjonstest/RelationTestResultsTable';
import { IClient } from '~/types/Clients';
import { IComponent } from '~/types/Component';

import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Relasjonstest' }, { name: 'description', content: 'Relasjonstest' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleRelationTestAction(args);

class IPageLoaderData {
    components: IComponent[] = [];
    clients: IClient[] = [];
    relationTests: any;
    configs: any;
}

export default function Index() {
    const breadcrumbs = [{ name: 'Relasjonstest', link: '/relasjonstest' }];
    const { components, clients, relationTests, configs } = useLoaderData<IPageLoaderData>();

    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<any>;
    const { alertState } = useAlerts<any>([], actionData);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (
            relationTests.some((test: { status: string }) =>
                [
                    'STARTED',
                    'FETCHING_RESOURCES',
                    'CREATING_ENTRY_REPORTS',
                    'PROCESSING_LINKS',
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
                window.location.reload();
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
            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />
            {fetcher.state !== 'submitting' && !actionData && (
                <Alert variant="warning">
                    Advarsel: Passordet til klienten du kjører testen på, vil bli nullstilt under
                    testkjøringen. Det anbefales derfor å bruke en dedikert klient for testing.
                </Alert>
            )}
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
