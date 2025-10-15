import { TerminalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Heading, Loader, VStack } from '@navikt/ds-react';
import {type  ApiResponse } from 'novari-frontend-components';
import React from 'react';
import { type ActionFunctionArgs, type MetaFunction, useFetcher, useLoaderData } from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { handleBasicTestAction } from '~/routes/basistest/actions';
import BasicTestAddForm from '~/routes/basistest/BasicTestAddForm';
import CacheStatusTable from '~/routes/basistest/CacheStatusTable';
import HealthTestResultsTable from '~/routes/basistest/HealthTestResultsTable';
import type { IBasicTestResponse } from '~/types';
import { IClient } from '~/types/Clients';
import { IComponent } from '~/types/Component';

import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Basis Test' }, { name: 'description', content: 'Run Basis Test' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleBasicTestAction(args);

type ExtendedFetcherResponseData = ApiResponse<IBasicTestResponse> & {
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
                            {actionData && actionData.variant && (
                                <>
                                    {/*{actionData.variant === 'success' && (*/}
                                    <Box className="pb-10">
                                        <Alert variant={actionData.variant}>
                                            <Heading size="small">
                                                {actionData.variant === 'error'
                                                    ? 'Error running test:'
                                                    : 'Test completed:'}
                                            </Heading>
                                            <BodyShort>
                                                {actionData.message}: {actionData.testUrl}
                                            </BodyShort>
                                            <BodyShort>
                                                Klient:{' '}
                                                {actionData.clientName
                                                    ? actionData.clientName
                                                    : ' ingen klient'}
                                            </BodyShort>
                                        </Alert>
                                    </Box>
                                    {/*)}*/}

                                    {actionData.data.healthData.healthData && (
                                        <>
                                            <Heading size={'medium'}>
                                                Resultat av helsetest:{' '}
                                            </Heading>
                                            <HealthTestResultsTable
                                                logResults={actionData.data.healthData.healthData}
                                            />
                                        </>
                                    )}

                                    {actionData.data.cacheData.resourceResults && (
                                        <>
                                            <Heading size={'medium'} className={'pt-5'}>
                                                Cache status:
                                            </Heading>
                                            <CacheStatusTable
                                                logResults={
                                                    actionData.data.cacheData.resourceResults
                                                }
                                            />
                                        </>
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
