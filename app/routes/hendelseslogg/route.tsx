import { TasklistSendIcon } from '@navikt/aksel-icons';
import { Box, VStack } from '@navikt/ds-react';
import { type ApiResponse, NovariToaster, useAlerts } from 'novari-frontend-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    type ActionFunctionArgs,
    type MetaFunction,
    useFetcher,
    useLoaderData,
} from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';
import { handleLogAction } from '~/routes/hendelseslogg/actions';
import LogSearchForm from '~/routes/hendelseslogg/LogSearchForm';
import type { AuditEvent, IComponentConfig } from '~/types';
import { IComponent } from '~/types/Component';
import { Log, ReduntantLog } from '~/types/LogEvent';

import { loader } from './loaders';
import LogTable from './LogTable';

export const meta: MetaFunction = () => {
    return [{ title: 'Hendelseslogg' }, { name: 'description', content: 'Hendelseslogg' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleLogAction(args);

interface IPageLoaderData {
    components: IComponent[];
    configs: IComponentConfig[];
}

export default function Index() {
    const { t } = useTranslation();
    const breadcrumbs = [{ name: t('menu.eventLog'), link: '/hendelseslogg' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<AuditEvent[]>;
    const { components, configs } = useLoaderData<IPageLoaderData>();
    const logs = actionData?.data || [];
    const mappedLogs = mapLogs(logs);
    const [filterValue, setFilterValue] = useState('');
    const { alertState } = useAlerts<AuditEvent[]>([], actionData, fetcher.state);

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
                title={t('menu.eventLog')}
                icon={TasklistSendIcon}
                helpText="hendelseslogg"
            />

            <NovariToaster items={alertState} position={'top-right'} />

            <VStack gap={'space-12'}>
                <Box
                    padding="space-16"
                    borderColor="neutral-subtle"
                    borderWidth="2"
                    borderRadius="12">
                    <LogSearchForm
                        onSearchSubmit={handleFormSubmit}
                        components={components}
                        configs={configs}
                        onFilter={(value: string) => setFilterValue(value)}
                    />
                </Box>

                {filteredLogs.length > 0 && (
                    <Box
                        padding="space-16"
                        borderColor="neutral-subtle"
                        borderWidth="2"
                        borderRadius="12">
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
