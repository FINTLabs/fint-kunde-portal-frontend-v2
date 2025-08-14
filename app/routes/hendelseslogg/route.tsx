import React, { useState } from 'react';
import { ActionFunctionArgs, MetaFunction } from 'react-router';
import { useFetcher, useLoaderData } from 'react-router';
import { Box, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TasklistSendIcon } from '@navikt/aksel-icons';
import LogSearchForm from '~/routes/hendelseslogg/LogSearchForm';
import LogTable from './LogTable';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { Log, ReduntantLog } from '~/types/LogEvent';
import { handleLogAction } from '~/routes/hendelseslogg/actions';
import { loader } from './loaders';
import { IComponent } from '~/types/Component';

export const meta: MetaFunction = () => {
    return [{ title: 'Hendelseslogg' }, { name: 'description', content: 'Hendelseslogg' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleLogAction(args);

class IPageLoaderData {
    components: IComponent[] = [];
    configs: any;
}

export default function Index() {
    const breadcrumbs = [{ name: 'Hendelseslogg', link: '/hendelseslogg' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const { components, configs } = useLoaderData<IPageLoaderData>();
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
                icon={TasklistSendIcon}
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
