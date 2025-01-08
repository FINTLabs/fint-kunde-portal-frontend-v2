import React from 'react';
import { useFetcher, useLoaderData, useNavigate, useParams } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import ClientApi from '~/api/ClientApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, TokenIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, Heading, HGrid } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentApi from '~/api/ComponentApi';
import { IComponent } from '~/types/Component';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { getComponentIds } from '~/utils/helper';
import ComponentList from '~/components/shared/ComponentList';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import AlertManager from '~/components/AlertManager';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { GeneralDetailView } from '~/components/shared/GeneralDetailView';
import { AuthTable } from '~/components/shared/AuthTable';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    const clientResponse = await ClientApi.getClientById(orgName, id);
    const componentsResponse = await ComponentApi.getOrganisationComponents(orgName);
    const featuresResponse = await FeaturesApi.fetchFeatures();
    const accessResponse =
        id && featuresResponse.data?.['access-controll-new']
            ? await AccessApi.getClientorAdapterAccess(id)
            : null;

    return new Response(
        JSON.stringify({
            client: clientResponse,
            components: componentsResponse.data,
            features: featuresResponse.data,
            access: accessResponse,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

interface IExtendedFetcherResponseData extends IFetcherResponseData {
    clientSecret?: string;
}

export default function ClientDetails() {
    const { client, components, features, access } = useLoaderData<{
        client: IClient;
        components: IComponent[];
        features: Record<string, boolean>;
        access: IAccess[];
    }>();

    const navigate = useNavigate();
    const hasAccessControl = features['access-controll-new'];

    const { id } = useParams();
    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: `${id}`, link: `/klienter/${id}` },
    ];

    const fetcher = useFetcher();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

    const handleUpdate = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_CLIENT');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleDelete = () => {
        const formData = new FormData();
        formData.append('actionType', 'DELETE_CLIENT');
        formData.append('clientId', client.name);
        fetcher.submit(formData, { method: 'post' });
    };

    const handleUpdatePassword = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_PASSWORD');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleUpdateAuthInfo = (formData: FormData) => {
        formData.append('actionType', 'GET_SECRET');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleToggle = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_COMPONENT_IN_CLIENT');
        formData.append('adapterName', client?.name as string);
        fetcher.submit(formData, { method: 'post' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={client?.shortDescription || ''} icon={TokenIcon} />
            <AlertManager alerts={alerts} />

            {!client ? (
                <Alert variant="warning">Det finnes ingen klienter ved navn {id} i listen</Alert>
            ) : (
                <HGrid gap="2" align={'start'}>
                    <Box>
                        <Button
                            data-cy="back-button"
                            className="relative h-12 w-12 top-2 right-14"
                            icon={<ArrowLeftIcon title="ArrowLeftIcon" fontSize="1.5rem" />}
                            variant="tertiary"
                            onClick={() => navigate(`/klienter`)}></Button>
                    </Box>

                    <Box
                        className="w-full relative bottom-12"
                        padding="6"
                        borderRadius="large"
                        shadow="small">
                        <GeneralDetailView
                            resource={client}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />

                        {!client.managed && (
                            <>
                                <Divider className="pt-3" />
                                <Heading size={'medium'}>Autentisering</Heading>
                                <AuthTable
                                    entity={client}
                                    entityType="client"
                                    onUpdatePassword={handleUpdatePassword}
                                    onUpdateAuthInfo={handleUpdateAuthInfo}
                                    {...(actionData?.clientSecret
                                        ? { clientSecret: actionData.clientSecret }
                                        : {})}
                                />
                                <Divider className="pt-10" />
                            </>
                        )}

                        <Divider className="pt-10" />

                        {hasAccessControl ? (
                            <>
                                <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>
                                <ComponentList
                                    accessList={access}
                                    entity={client.name}
                                    onToggle={handleToggle}
                                />
                            </>
                        ) : (
                            <>
                                <Heading size={'medium'}>Komponenter</Heading>
                                <ComponentsTable
                                    items={components}
                                    selectedItems={getComponentIds(client.components)}
                                    toggle={handleToggle}
                                    hideLink={true}
                                    isManaged={client.managed}
                                />
                            </>
                        )}
                    </Box>
                </HGrid>
            )}
        </>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const clientName = params.id || '';
    const actionType = formData.get('actionType') as string;
    let response;

    switch (actionType) {
        case 'UPDATE_CLIENT':
            response = await ClientApi.updateClient(
                clientName,
                formData.get('shortDescription') as string,
                formData.get('note') as string,
                orgName
            );
            break;

        case 'DELETE_CLIENT':
            response = await ClientApi.deleteClient(clientName, orgName);
            return redirect(`/klienter?deleted=${clientName}`);

        case 'UPDATE_COMPONENT_IN_CLIENT':
            const componentName = formData.get('componentName') as string;
            const updateType = formData.get('isChecked') as string;
            response = await ClientApi.updateComponentInClient(
                componentName,
                clientName,
                orgName,
                updateType
            );
            break;

        case 'UPDATE_PASSWORD':
            response = await ClientApi.setPassword(
                formData.get('entityName') as string,
                formData.get('password') as string,
                orgName
            );
            break;

        case 'GET_SECRET':
            const secretResponse = await ClientApi.getOpenIdSecret(
                formData.get('entityName') as string,
                orgName
            );

            response = {
                clientSecret: secretResponse.data,
                message: 'Klienthemmeligheten ble hentet',
                variant: 'success',
            };
            break;
        default:
            response = {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }

    return response;
}
