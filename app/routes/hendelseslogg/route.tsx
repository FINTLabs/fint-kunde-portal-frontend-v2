import React, { useState } from 'react';
import { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { Box, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import LogSearchForm from '~/routes/hendelseslogg/LogSearchForm';
import ComponentApi from '~/api/ComponentApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import LogApi from '~/api/LogApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import LogTable from './LogTable';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { Log, ReduntantLog } from '~/types/LogEvent';

export const meta: MetaFunction = () => {
    return [{ title: 'Hendelseslogg' }, { name: 'description', content: 'Hendelseslogg' }];
};
export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);

    const components = await ComponentApi.getOrganisationComponents(selectOrg);
    const configs = await ComponentConfigApi.getComponentConfigs();

    return new Response(
        JSON.stringify({
            components: components.data,
            configs: configs.data,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

export default function Index() {
    const breadcrumbs = [{ name: 'Hendelseslogg', link: '/hendelseslogg' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const { components, configs } = useLoaderData<typeof loader>();
    const logs = actionData?.data || [];
    const mappedLogs = mapLogs(logs);
    const [filterValue, setFilterValue] = useState('');
    const { alerts } = useAlerts(actionData, fetcher.state);

    const filteredLogs = filterValue
        ? mappedLogs.filter((log: Log) => log.id === filterValue)
        : mappedLogs;

    const handleFormSubmit = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/hendelseslogg' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Hendelseslogg'}
                icon={TerminalIcon}
                helpText="hendelseslogg"
            />

            <VStack gap={'10'}>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <LogSearchForm
                        onSearchSubmit={handleFormSubmit}
                        components={components}
                        configs={configs}
                        onFilter={(value: string) => setFilterValue(value)}
                    />
                </Box>
                <AlertManager alerts={alerts} />

                {filteredLogs.length > 0 && (
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <LogTable logs={filteredLogs} />
                    </Box>
                )}
            </VStack>
        </>
    );
}

function mapLogs(logs: ReduntantLog[]) {
    return logs.reduce((acc: Log[], curr: ReduntantLog) => {
        const existingLog = acc.find((log) => log.id === curr.corrId);

        const currentEvent = curr.event;
        const event = {
            timestamp: currentEvent.time,
            klient: currentEvent.client,
            status: currentEvent.status,
            response: currentEvent.responseStatus || '',
            melding: currentEvent.message || '',
        };

        if (!existingLog) {
            acc.push({
                id: curr.corrId,
                timestamp: curr.timestamp,
                action: curr.event.action,
                events: [event],
            });
        } else {
            existingLog.events.push(event);
        }

        return acc;
    }, []);
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const environment = formData.get('environment') as string;
    const componentName = formData.get('component') as string;
    const action = formData.get('action') as string;
    const resource = formData.get('resource') as string;

    const orgName = await getSelectedOrganization(request);

    let response;

    response = await LogApi.getLogs(environment, orgName, componentName, resource, action);
    if (!response.success || response.data.length === 0) {
        response = {
            success: false,
            message: `Kunne ikke hente logger for spesifisert ressurs.`,
            variant: 'error',
        };
    }

    return response;
}
