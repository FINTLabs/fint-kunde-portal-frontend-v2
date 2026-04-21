import { TerminalIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, Loader, LocalAlert, VStack } from '@navikt/ds-react';
import { type ApiResponse } from 'novari-frontend-components';
import React from 'react';
import {
    type ActionFunctionArgs,
    type MetaFunction,
    useFetcher,
    useLoaderData,
} from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';
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

    const isSubmitting = fetcher.state === 'submitting';
    const variant = actionData?.variant;
    const healthResults = actionData?.data?.healthData?.healthData;
    const cacheResults = actionData?.data?.cacheData?.resourceResults;
    const hasActionData = Boolean(actionData);
    //TODO: fix local alert when info is updated in novari components
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Basistest'} icon={TerminalIcon} helpText="basistest" />
            <VStack gap={'space-24'}>
                {fetcher.state !== 'submitting' && !actionData && (
                    <LocalAlert status="warning">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Passordet til klienten</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            Passordet til klienten du kjører testen på, vil bli nullstilt under
                            testkjøringen. Det anbefales derfor å bruke en dedikert klient for
                            testing.
                        </LocalAlert.Content>
                    </LocalAlert>
                )}
                <Box
                    padding="space-16"
                    borderColor="neutral-subtle"
                    borderWidth="2"
                    borderRadius="12">
                    <BasicTestAddForm
                        components={components}
                        clients={clients}
                        onSearchSubmit={handleSearchSubmit}
                    />
                </Box>

                {hasActionData && (
                    <>
                        {isSubmitting ? (
                            <Loader size="large" title="Laster inn data..." />
                        ) : (
                            <>
                                {variant && (
                                    <>
                                        <LocalAlert
                                            status={variant === 'info' ? 'announcement' : variant}>
                                            <Heading size="small">
                                                {variant === 'error'
                                                    ? 'Error running test:'
                                                    : 'Test completed:'}
                                            </Heading>

                                            <BodyShort>
                                                {actionData.message}: {actionData.testUrl}
                                            </BodyShort>

                                            <BodyShort>
                                                Klient: {actionData.clientName || 'ingen klient'}
                                            </BodyShort>
                                        </LocalAlert>
                                    </>
                                )}

                                {healthResults && (
                                    <Box
                                        padding="space-16"
                                        borderColor="neutral-subtle"
                                        borderWidth="2"
                                        borderRadius="12">
                                        <Heading size="medium">Resultat av helsetest:</Heading>
                                        <HealthTestResultsTable logResults={healthResults} />
                                    </Box>
                                )}

                                {cacheResults && (
                                    <Box
                                        padding="space-16"
                                        borderColor="neutral-subtle"
                                        borderWidth="2"
                                        borderRadius="12">
                                        <Heading size="medium" className="pt-5">
                                            Cache status:
                                        </Heading>
                                        <CacheStatusTable logResults={cacheResults} />
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
