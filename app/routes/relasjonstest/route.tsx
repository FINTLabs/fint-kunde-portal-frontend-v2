import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import React, { useState } from 'react';
import { Box, VStack } from '@navikt/ds-react';
import TestAddForm from '~/routes/relasjonstest/TestAddForm';
import TestResultsTable from '~/routes/relasjonstest/TestResultsTable';
import ComponentApi from '~/api/ComponentApi';
import { getSelectedOprganization } from '~/utils/selectedOrganization';
import { json, useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';

export const meta: MetaFunction = () => {
    return [
        { title: 'Relasjonstest' },
        { name: 'description', content: 'Liste over hendelseslogg' },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const components = await ComponentApi.getAllComponents();
        const orgName = await getSelectedOprganization(request);
        const clients = await ClientApi.getClients(orgName);
        return json({ components, clients });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

const fakeData = [
    {
        tid: '2021-01-01 12:00',
        status: 'OK',
        env: 'Prod',
        ressurs: 'Resource1',
        something: 5,
        relasjonsfeil: 0,
        sunneLenker: 10,
        rapportLink: '/report/1',
    },
    {
        tid: '2021-01-02 14:00',
        status: 'Fail',
        env: 'Dev',
        ressurs: 'Resource2',
        something: 3,
        relasjonsfeil: 2,
        sunneLenker: 8,
        rapportLink: '/report/2',
    },
    // Add more fake data as needed
];

export default function Index() {
    const [logResults, setLogResults] = useState(null);
    const { components, clients } = useLoaderData<{
        components: IComponent[];
        clients: IClient[];
    }>();

    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];

    function handleSearch() {
        // Simulate a search by setting the fake data
        setLogResults(fakeData);
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Relasjonstest'}
                icon={TerminalIcon}
                helpText="relasjonstest"
            />
            <VStack gap={'6'}>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <TestAddForm
                        handleSearch={handleSearch}
                        components={components}
                        clients={clients}
                    />
                </Box>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <TestResultsTable logResults={logResults} />
                </Box>
            </VStack>
        </>
    );
}
