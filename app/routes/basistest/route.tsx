import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, VStack } from '@navikt/ds-react';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import ComponentApi from '~/api/ComponentApi';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import BasicTestAddForm from '~/routes/basistest/BasicTestAddForm';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
// import HealthStatusTable from '~/routes/hendelseslogg/HealthStatusTable';
import CacheStatusTable from '~/routes/basistest/CacheStatusTable';
// import BasicTestApi from '~/api/BasicTestApi';

interface ActionData {
    message: string;
    data: never;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Basis Test' }, { name: 'description', content: 'Run Basis Test' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const selectOrg = await getSelectedOrganization(request);
    try {
        const components = await ComponentApi.getOrganisationComponents(selectOrg);
        const clients = await ClientApi.getClients(selectOrg);

        const sortedComponents = components.sort((a: IComponent, b: IComponent) =>
            a.name.localeCompare(b.name)
        );
        const sortedClients = clients.sort((a: IClient, b: IClient) =>
            a.name.localeCompare(b.name)
        );

        return json({ components: sortedComponents, clients: sortedClients });
    } catch (err) {
        console.error('Error fetching data:', err as Error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const environment = formData.get('environment') as string;
    const component = formData.get('component');
    const client = formData.get('client');

    const orgName = await getSelectedOrganization(request);

    const response: never[] = [];
    const message = 'Run test with: ' + component + ' ' + client + ' ' + environment + orgName;

    return json({ message, data: response });
}

export default function Index() {
    const breadcrumbs = [{ name: 'Basistest', link: '/basistest' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as ActionData;

    const { components, clients } = useLoaderData<{
        components: IComponent[];
        clients: IClient[];
    }>();

    const handleFormSubmit = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/basistest' });
    };
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Basistest'} icon={TerminalIcon} helpText="basistest" />
            <VStack gap={'6'}>
                <Alert variant="warning">
                    Advarsel - Passordet på klienten du kjører test på kommer til å bli nullstilt
                    når du kjører en test. Bruk av en dedikert klient for testing anbefales.
                </Alert>
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <BasicTestAddForm
                        components={components}
                        clients={clients}
                        onSearchSubmit={handleFormSubmit}
                    />
                </Box>
                {actionData ? (
                    <>
                        {actionData.message && (
                            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                                <Alert variant="info">{actionData.message}</Alert>
                            </Box>
                        )}

                        {actionData.data && actionData.data.length > 0 && (
                            <>
                                <Box
                                    className="w-full"
                                    padding="6"
                                    borderRadius="large"
                                    shadow="small">
                                    <CacheStatusTable logResults={actionData.data} />
                                </Box>
                            </>
                        )}
                    </>
                ) : (
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <BodyShort>Bruk skjemaet for å lage en rapport</BodyShort>
                    </Box>
                )}{' '}
            </VStack>
        </>
    );
}
