import { LayersIcon } from '@navikt/aksel-icons';
import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';
import { type ApiResponse, NovariSnackbar, useAlerts } from 'novari-frontend-components';
import {
    type ActionFunctionArgs,
    type MetaFunction,
    useFetcher,
    useLoaderData,
    useParams,
} from 'react-router';

import { AuthTable } from '~/components/shared/AuthTable';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { GeneralDetailView } from '~/components/shared/GeneralDetailView';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';
import { handleAdapterAction } from '~/routes/adapter.$name/actions';
import { IAdapter } from '~/types/Adapter';

import { loader } from './loaders';
import { IComponent } from '~/types';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleAdapterAction(args);

interface IExtendedFetcherResponseData extends ApiResponse<IAdapter> {
    clientSecret?: string;
}

export default function Index() {
    const { adapters, components } = useLoaderData<{
        adapters: IAdapter[];
        components: IComponent[];
        orgName: string;
    }>();
    const fetcher = useFetcher<ApiResponse<IAdapter>>();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { name } = useParams();
    // const hasAccessControl = features['access-controll-new'];
    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `${name}`, link: `/adapter/${name}` },
    ];

    const filteredAdapters = adapters.filter((a) => a.name === name);
    const adapter = filteredAdapters.length > 0 ? filteredAdapters[0] : null;
    const displayName = adapter?.name.split('@')[0] || '';
    const { alertState } = useAlerts<IAdapter>([], actionData, fetcher.state);

    // const [isLoading, setIsLoading] = useState(false);
    //
    // let selectedEnvs: Environment[] = [];
    // if (access?.environments)
    //     selectedEnvs = (Object.keys(access.environments) as Environment[]).filter(
    //         (env) => access.environments[env]
    //     );

    const handleUpdate = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_ADAPTER');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleDelete = (formData: FormData) => {
        formData.append('actionType', 'DELETE_ADAPTER');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleToggle = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_COMPONENT_IN_ADAPTER');
        formData.append('componentName', formData.get('componentName') as string);
        formData.append('adapterName', name as string);
        formData.append('isChecked', formData.get('isChecked') as string);
        fetcher.submit(formData, { method: 'post' });
    };

    const handleUpdatePassword = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_PASSWORD');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleUpdateAuthoInfo = (formData: FormData) => {
        formData.append('actionType', 'GET_SECRET');
        fetcher.submit(formData, { method: 'post' });
    };

    const selectedComponents =
        adapter?.components
            .map((adapterComponent) => {
                const matchedComponent = components.find((c) => c.dn === adapterComponent);
                return matchedComponent?.name;
            })
            .filter((name): name is string => name !== undefined) || [];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={displayName ? displayName : 'Error'}
                icon={LayersIcon}
                helpText="adapter detaljer"
            />

            <NovariSnackbar
                data-cy="snackbar"
                items={alertState}
                position={'top-right'}
                // onCloseItem={handleCloseItem}
            />

            {adapter && (
                <VStack gap="space-24">
                    {/*<BackButton to={`/adaptere`} className="relative h-12 w-12 top-2 right-14" />*/}
                    <Box
                        padding="space-16"
                        borderColor="neutral-subtle"
                        borderWidth="2"
                        borderRadius="12">
                        <GeneralDetailView
                            resource={adapter}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    </Box>
                    {!adapter.managed && (
                        <Box
                            padding="space-16"
                            borderColor="neutral-subtle"
                            borderWidth="2"
                            borderRadius="12">
                            <Heading size={'medium'}>Autentisering</Heading>
                            <AuthTable
                                entity={adapter}
                                entityType="adapter"
                                onUpdatePassword={handleUpdatePassword}
                                onUpdateAuthInfo={handleUpdateAuthoInfo}
                                {...(actionData?.clientSecret
                                    ? { clientSecret: actionData.clientSecret }
                                    : {})}
                            />
                        </Box>
                    )}

                    <Box
                        padding="space-16"
                        borderColor="neutral-subtle"
                        borderWidth="2"
                        borderRadius="12">
                        <HGrid gap="space-2">
                            <Heading size={'medium'}>Komponenter</Heading>

                            <ComponentsTable
                                items={components}
                                selectedItems={selectedComponents}
                                toggle={handleToggle}
                                isManaged={adapter.managed}
                                fromAdapter={adapter.name}
                            />
                        </HGrid>
                    </Box>
                </VStack>
            )}
        </>
    );
}
