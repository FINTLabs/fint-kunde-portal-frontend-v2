import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, VStack } from '@navikt/ds-react';
import LogSearchForm from '~/routes/hendelseslogg/LogSearchForm';
import ComponentApi from '~/api/ComponentApi';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import { log } from '~/utils/logger';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import { IComponentConfig } from '~/types/ComponentConfig';
import LogApi from '~/api/LogApi';
import HealthStatusTable from '~/routes/hendelseslogg/HealthStatusTable';
import CacheStatusTable from '~/routes/hendelseslogg/CacheStatusTable';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { getFormData } from '~/utils/requestUtils';
import { InfoBox } from '~/components/shared/InfoBox';
import { Log, ReduntantLog } from '~/types/types';

interface ActionData {
    message: string;
    data: any;
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Hendelseslogg' },
        { name: 'description', content: 'Liste over hendelseslogg' },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);
    try {
        const components = await ComponentApi.getOrganisationComponents(selectOrg);
        const configs = await ComponentConfigApi.getComponentConfigs(); // rename to something else - returns a list of components with associated classes, these classes are the configurations
        const defaultLogs = await LogApi.getLogs('beta', selectOrg, 'felles_kodeverk', 'GET_ALL');
        return json({ components, configs, defaultLogs });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const actionName = 'Action in hendelsesslogg/route.tsx';
    const formData = await request.formData();
    console.log('formData');
    console.log(formData);
    const environment = formData.get('environment') as string;
    const componentName = getFormData(formData.get('component'), 'component', actionName);
    const action = getFormData(formData.get('action'), 'action', actionName);
    const configClass = formData.get('configClass') as string;
    log('comp:', componentName);
    log('action:', action);

    const orgName = await getSelectedOrganization(request);
    // const query = `${component}/${action}_${configClass.toUpperCase()}`;

    let response;
    let message = '';

    try {
        response = await LogApi.getLogs(environment, orgName, componentName, action);
        log('response:', response.length);

        if (!response) {
            message = 'Error occurred';
        } else if (response && response.length === 0) {
            message = 'No logs found';
        }
    } catch (error) {
        message = 'Error occurred';
        response = null;
        log('Error fetching logs:', error);
    }

    return json({ message, data: response });
}

// Mapped log
type LogHashMap = {
    [key: string]: ReduntantLog[];
};

export default function Index() {
    const breadcrumbs = [{ name: 'Hendelseslogg', link: '/hendelseslogg' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as ActionData;

    const { components, configs, defaultLogs } = useLoaderData<typeof loader>();

    const logs = actionData?.data || defaultLogs;
    console.log('logs uten mapping:', logs);

    const mappedLogs = mapLogs(logs);

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
                        // handleSearch={handleSearch}
                        f={fetcher}
                        components={components}
                        configs={configs}
                    />
                </Box>

                {defaultLogs && (
                    <InfoBox
                        message={`Displaying default logs: await LogApi.getLogs('beta', selectOrg, 'felles_kodeverk', 'GET_ALL');`}
                    />
                )}
                {logs ? (
                    <>
                        {actionData?.message && (
                            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                                <Alert variant="info">{actionData.message}</Alert>
                            </Box>
                        )}
                        {logs.length > 0 && (
                            <>
                                <Box
                                    className="w-full"
                                    padding="6"
                                    borderRadius="large"
                                    shadow="small">
                                    <HealthStatusTable logs={mappedLogs} />
                                </Box>
                                <Box
                                    className="w-full"
                                    padding="6"
                                    borderRadius="large"
                                    shadow="small">
                                    <CacheStatusTable logResults={logs} />
                                </Box>
                            </>
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
    const mappedLogs = logs.reduce((acc: Log[], curr: ReduntantLog) => {
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
            return [
                ...acc,
                {
                    id: curr.corrId,
                    timestamp: curr.timestamp,
                    action: curr.event.action,
                    events: [event],
                },
            ];
        } else {
            existingLog.events.push(event);
            return acc;
        }
    }, [] as Log[]);

    console.log('MAPPED LOGS');
    console.log(mappedLogs);
    return mappedLogs;
}
