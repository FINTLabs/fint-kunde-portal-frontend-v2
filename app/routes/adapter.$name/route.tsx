import {
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    type MetaFunction,
    redirect,
} from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { useFetcher, useLoaderData, useParams } from '@remix-run/react';
import ComponentApi from '~/api/ComponentApi';
import AdapterApi from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import React from 'react';
import { Alert, Box, Heading, HGrid } from '@navikt/ds-react';
import AlertManager from '~/components/AlertManager';
import { BackButton } from '~/components/shared/BackButton';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { AuthTable } from '~/components/shared/AuthTable';
import ComponentList from '~/components/shared/ComponentList';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { getComponentIds } from '~/utils/helper';
import { IComponent } from '~/types/Component';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { IAdapter } from '~/types/Adapter';
import { GeneralDetailView } from '~/components/shared/GeneralDetailView';

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const orgName = await getSelectedOrganization(request);
    const adapterName = params.name;

    const [adaptersResponse, componentsResponse, featuresResponse] = await Promise.all([
        AdapterApi.getAdapters(orgName),
        ComponentApi.getOrganisationComponents(orgName),
        FeaturesApi.fetchFeatures(),
    ]);

    const features = featuresResponse.data;
    let access = null;
    if (adapterName && features && features['access-controll-new']) {
        const accessResponse = await AccessApi.getClientorAdapterAccess(adapterName);
        if (accessResponse.success) {
            access = accessResponse.data;
        }
    }

    return new Response(
        JSON.stringify({
            adapters: adaptersResponse.data,
            components: componentsResponse.data,
            features: featuresResponse.data,
            access,
            orgName,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

interface IExtendedFetcherResponseData extends IFetcherResponseData {
    clientSecret?: string;
}

export default function Index() {
    // TODO: get adapter based on ID.
    const { components, adapters, features, access } = useLoaderData<{
        components: IComponent[];
        adapters: IAdapter[];
        features: Record<string, boolean>;
        access: IAccess[];
    }>();
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { name } = useParams();
    const hasAccessControl = features['access-controll-new'];
    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `${name}`, link: `/adapter/${name}` },
    ];

    const filteredAdapters = adapters.filter((a) => a.name === name);
    const adapter = filteredAdapters.length > 0 ? filteredAdapters[0] : null;
    const displayName = adapter?.name.split('@')[0] || '';
    const { alerts } = useAlerts(actionData, fetcher.state);

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
        formData.append('adapterName', adapter?.name as string);
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

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={displayName ? displayName : 'Error'}
                icon={MigrationIcon}
                helpText="adapter detaljer"
            />

            <AlertManager alerts={alerts} />

            {!adapter ? (
                <Alert variant="warning">
                    Det finnes ingen adapter ved navn ${name} i listen over adaptere
                </Alert>
            ) : (
                <HGrid gap="2" align={'start'}>
                    <BackButton to={`/adaptere`} className="relative h-12 w-12 top-2 right-14" />
                    <Box
                        className="w-full relative bottom-12"
                        padding="6"
                        borderRadius="large"
                        shadow="small">
                        {/*<VStack gap="5">*/}
                        <GeneralDetailView
                            resource={adapter}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />

                        {!adapter.managed && (
                            <>
                                <Divider className="pt-3" />
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
                            </>
                        )}
                        <Divider className="pt-3" />

                        {hasAccessControl ? (
                            <>
                                <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>
                                <ComponentList
                                    accessList={access}
                                    entity={adapter.name}
                                    onToggle={handleToggle}
                                />
                            </>
                        ) : (
                            <Box padding="6">
                                <HGrid gap="2">
                                    <Heading size={'medium'}>Komponenter</Heading>
                                    <ComponentsTable
                                        items={components}
                                        selectedItems={getComponentIds(adapter.components)}
                                        toggle={handleToggle}
                                        hideLink={true}
                                    />
                                </HGrid>
                            </Box>
                        )}
                        {/*</VStack>*/}
                    </Box>
                </HGrid>
            )}
        </>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    const name = params.name || '';
    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const actionType = formData.get('actionType') as string;

    let response;
    switch (actionType) {
        case 'UPDATE_PASSWORD':
            response = await AdapterApi.setPassword(
                formData.get('entityName') as string,
                formData.get('password') as string,
                orgName
            );
            break;
        case 'GET_SECRET':
            response = await AdapterApi.getOpenIdSecret(
                formData.get('entityName') as string,
                orgName
            );
            response = {
                clientSecret: response.data,
                message: 'Adapterhemmelighet ble hentet',
                variant: 'success',
            };
            break;
        case 'UPDATE_ADAPTER':
            response = await AdapterApi.updateAdapter(
                {
                    name,
                    shortDescription: formData.get('shortDescription') as string,
                    note: formData.get('note') as string,
                },
                orgName
            );
            break;
        case 'UPDATE_COMPONENT_IN_ADAPTER':
            response = await AdapterApi.updateComponentInAdapter(
                formData.get('componentName') as string,
                formData.get('adapterName') as string,
                orgName,
                formData.get('isChecked') as string
            );
            break;
        case 'DELETE_ADAPTER':
            response = await AdapterApi.deleteAdapter(name, orgName);
            return redirect(`/adaptere?deleted=${name}`);
        default:
            response = {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }

    return response;
}
