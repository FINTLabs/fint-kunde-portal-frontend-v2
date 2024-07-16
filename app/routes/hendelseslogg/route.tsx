import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import React, { useState } from 'react';
import { BodyShort, Box, VStack } from '@navikt/ds-react';
import LogSearchForm from '~/routes/hendelseslogg/LogSearchForm';
import ComponentApi from '~/api/ComponentApi';
import { json, useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import { log } from '~/utils/logger';
import ComponentConfigApi from '~/api/ComponentConfigApi';
import { IComponentConfig } from '~/types/ComponentConfig';
import LogApi from '~/api/LogApi';
import HealthStatusTable from '~/routes/hendelseslogg/HealthStatusTable';
import CacheStatusTable from '~/routes/hendelseslogg/CacheStatusTable';

export const meta: MetaFunction = () => {
    return [
        { title: 'Hendelseslogg' },
        { name: 'description', content: 'Liste over hendelseslogg' },
    ];
};

export const loader: LoaderFunction = async () => {
    try {
        const components = await ComponentApi.getAllComponents();
        const configs = await ComponentConfigApi.getComponentConfigs();
        return json({ components, configs });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const [logResults, setLogResults] = useState(null);
    const { components, configs } = useLoaderData<{
        components: IComponent[];
        configs: IComponentConfig[];
    }>();

    const handleSearch = async (
        environment: string,
        component: string,
        configClass: string,
        action: string
    ) => {
        log('on search', component, environment, action, configClass);
        const query = component + '/' + action + '_' + configClass.toUpperCase();
        //TODO fix url here
        // https://kunde-beta.felleskomponent.no/api/events/fintlabs_no/api/utdanning-elev/GET_ALL_BASISGRUPPE
        // http://localhost:8080/api/events/fintlabs_no/API/utdanning-elev/GET_ALL_BASISGRUPPEMEDLEMSKAP
        log(query);
        const orgName = 'fintlabs_no';
        //todo: get org name

        try {
            const logs = await LogApi.getLogs(environment, orgName, query);
            setLogResults(logs);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
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
                        handleSearch={handleSearch}
                        components={components}
                        configs={configs}
                    />
                </Box>

                {logResults ? (
                    <>
                        <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                            <HealthStatusTable logResults={logResults} />
                        </Box>
                        <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                            <CacheStatusTable logResults={logResults} />
                        </Box>
                    </>
                ) : (
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <BodyShort>please use the form to create a report</BodyShort>
                    </Box>
                )}
            </VStack>
        </>
    );
}
