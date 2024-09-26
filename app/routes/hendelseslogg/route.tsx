import { useState } from 'react';
import { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import { Alert, BodyShort, Box, Search, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import LogSearchForm from '~/routes/hendelseslogg/LogSearchForm';
import ComponentApi from '~/api/ComponentApi';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import LogApi from '~/api/LogApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { InfoBox } from '~/components/shared/InfoBox';
import { Log, ReduntantLog } from '~/types/types';
import LogTable from './LogTable';

interface ActionData {
    message: string;
    data: never;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Hendelseslogg' }, { name: 'description', content: 'Hendelseslogg' }];
};
export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);
    try {
        const components = await ComponentApi.getOrganisationComponents(selectOrg);
        const configs = await ComponentConfigApi.getComponentConfigs();
        const defaultLogs = await LogApi.getLogs(
            'beta',
            selectOrg,
            'felles_kodeverk',
            '',
            'GET_ALL'
        );
        return json({ components, configs, defaultLogs });
    } catch (err) {
        console.error('Error fetching data:', err as Error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const environment = formData.get('environment') as string;
    const componentName = formData.get('component') as string;
    const action = formData.get('action') as string;
    const resource = formData.get('resource') as string;

    const orgName = await getSelectedOrganization(request);

    let response;
    let message = '';

    try {
        response = await LogApi.getLogs(environment, orgName, componentName, resource, action);

        if (!response) {
            message = 'Error occurred';
        } else if (response && response.length === 0) {
            message = 'No logs found';
        }
    } catch (err) {
        message = 'Error occurred';
        response = null;
        console.error('Error fetching logs:', err as Error);
    }

    return json({ message, data: response });
}

export default function Index() {
    const breadcrumbs = [{ name: 'Hendelseslogg', link: '/hendelseslogg' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as ActionData;

    const { components, configs, defaultLogs } = useLoaderData<typeof loader>();
    const logs = actionData?.data || defaultLogs;
    const mappedLogs = mapLogs(logs);
    const [filterValue, setFilterValue] = useState('');

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

                {!actionData && (
                    <InfoBox
                        message={`Displaying default logs: await LogApi.getLogs('beta', selectOrg, 'felles_kodeverk', 'GET_ALL');`}
                    />
                )}
                {filteredLogs ? (
                    <>
                        {actionData?.message && (
                            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                                <Alert variant="info">{actionData.message}</Alert>
                            </Box>
                        )}
                        {filteredLogs.length > 0 ? (
                            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                                <LogTable logs={filteredLogs} />
                            </Box>
                        ) : (
                            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                                <BodyShort>No logs found with the specified ID</BodyShort>
                            </Box>
                        )}
                    </>
                ) : (
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <BodyShort>Please use the form to create a report</BodyShort>
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
