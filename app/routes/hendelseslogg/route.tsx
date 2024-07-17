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
import { getSelectedOprganization } from '~/utils/selectedOrganization';

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
    const selectOrg = await getSelectedOprganization(request);
    try {
        const components = await ComponentApi.getOrganisationComponents(selectOrg);
        const configs = await ComponentConfigApi.getComponentConfigs();
        return json({ components, configs });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const environment = formData.get('environment') as string;
    const component = formData.get('component');
    const action = formData.get('action');
    const configClass = formData.get('configClass') as string;
    log('on search:', component, environment, action, configClass);

    const orgName = await getSelectedOprganization(request);

    const query = `${component}/${action}_${configClass.toUpperCase()}`;
    log('url:', query);

    let response;
    let message = '';

    try {
        response = await LogApi.getLogs(environment, orgName, query);
        log('response:', response);

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

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const fetcher = useFetcher();
    const actionData = fetcher.data as ActionData;

    const { components, configs } = useLoaderData<{
        components: IComponent[];
        configs: IComponentConfig[];
    }>();

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
                                    <HealthStatusTable logResults={actionData.data} />
                                </Box>
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
                        <BodyShort>Please use the form to create a report</BodyShort>
                    </Box>
                )}
            </VStack>
        </>
    );
}
