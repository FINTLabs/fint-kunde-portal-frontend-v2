import { ArrowsSquarepathIcon, EraserIcon } from '@navikt/aksel-icons';
import { Box, Button, LocalAlert, VStack } from '@navikt/ds-react';
import { type ApiResponse, NovariToaster, useAlerts } from 'novari-frontend-components';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    type ActionFunctionArgs,
    type MetaFunction,
    useFetcher,
    useLoaderData,
} from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';
import { handleRelationTestAction } from '~/routes/relasjonstest/actions';
import RelationTestAddForm from '~/routes/relasjonstest/RelationTestAddForm';
import RelationTestResultsTable from '~/routes/relasjonstest/RelationTestResultsTable';
import type { IComponentConfig, ILinkWalkerTest } from '~/types';
import { IComponent } from '~/types/Component';

import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Relasjonstest' }, { name: 'description', content: 'Relasjonstest' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleRelationTestAction(args);

interface IPageLoaderData {
    components: IComponent[];
    relationTests: ILinkWalkerTest[];
    configs: IComponentConfig[];
}

export default function Index() {
    const { t } = useTranslation();
    const breadcrumbs = [{ name: t('menu.relationTest'), link: '/relasjonstest' }];
    const { components, relationTests, configs } = useLoaderData<IPageLoaderData>();

    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<ILinkWalkerTest>;
    const { alertState } = useAlerts<ILinkWalkerTest>([], actionData);

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
                //window.location.reload();
            }, 15000);
        }

        return () => clearInterval(interval);
    }, [relationTests, fetcher]);

    function runTest(testUrl: string) {
        const formData = new FormData();
        formData.append('testUrl', testUrl);
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
                title={t('menu.relationTest')}
                icon={ArrowsSquarepathIcon}
                helpText="relasjonstest"
            />
            <NovariToaster
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />
            <VStack gap={'space-12'}>
                {fetcher.state !== 'submitting' && !actionData && (
                    <LocalAlert status="warning">
                        <LocalAlert.Header>
                            <LocalAlert.Title>{t('mainRoutes.relationTest.warningTitle')}</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            {t('mainRoutes.relationTest.warningDescription')}
                        </LocalAlert.Content>
                    </LocalAlert>
                )}
                <Box
                    padding="space-16"
                    borderColor="neutral-subtle"
                    borderWidth="2"
                    borderRadius="12">
                    <RelationTestAddForm
                        components={components}
                        configs={configs}
                        runTest={runTest}
                    />
                    {relationTests && relationTests.length > 0 && (
                        <Box padding="space-16">
                            <Button
                                size={'xsmall'}
                                variant={'secondary'}
                                icon={<EraserIcon aria-hidden />}
                                onClick={removeAllTests}>
                                {t('mainRoutes.relationTest.removeAllButton')}
                            </Button>
                        </Box>
                    )}
                </Box>

                {relationTests && relationTests.length > 0 && (
                    <>
                        <Box
                            padding="space-16"
                            borderColor="neutral-subtle"
                            borderWidth="2"
                            borderRadius="12">
                            <RelationTestResultsTable
                                logResults={
                                    // Ensure logResults is of type ILogResults[]
                                    // Convert 'relationTests' to correct type if necessary (coerce 'errorMessage')
                                    relationTests.map((test) => ({
                                        ...test,
                                        errorMessage: test.errorMessage ?? '',
                                    }))
                                }
                            />
                        </Box>
                    </>
                )}
            </VStack>
        </>
    );
}
