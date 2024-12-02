import React, { useState } from 'react';
import { json, useFetcher, useLoaderData, useNavigate, useParams } from '@remix-run/react';
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
import { getFormData, getRequestParam } from '~/utils/requestUtils';
import { getComponentIds } from '~/utils/helper';
import ComponentList from '~/components/shared/ComponentList';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import { AuthTable } from '~/components/shared/AuthTable';
import { handleApiResponse } from '~/utils/handleApiResponse';
import AlertManager from '~/components/AlertManager';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import useAlerts from '~/components/useAlerts';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { GeneralDetailView } from '~/components/shared/GeneralDetailView';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';
    const client = await ClientApi.getClientById(orgName, id);
    const components = await ComponentApi.getOrganisationComponents(orgName);
    const features = await FeaturesApi.fetchFeatures();

    let access;
    if (id && features['access-controll-new']) {
        access = await AccessApi.getClientorAdapterAccess(id);
    }

    return json({ client, components, features, access });
}

interface IExtendedFetcherResponseData extends IFetcherResponseData {
    clientSecret?: string;
}

export default function Index() {
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

    const [isEditing, setIsEditing] = useState(false);
    const [shortDescription, setShortDescription] = useState(client?.shortDescription || '');
    const [note, setNote] = useState(client?.note || '');
    const fetcher = useFetcher();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

    const handleUpdate = (formData: FormData) => {
        formData.append('actionType', 'UPDATE_CLIENT');
        fetcher.submit(formData, {
            method: 'post',
        });

        setIsEditing(false);
    };

    function onComponentToggle() {
        console.info('------- handle component checkbox');
    }

    const handleDelete = () => {
        const formData = new FormData();
        formData.append('actionType', 'DELETE_CLIENT');
        formData.append('clientId', client.name);
        fetcher.submit(formData, { method: 'post' });
    };
    const handleCancel = () => {
        setShortDescription(client.shortDescription);
        setNote(client.note);
        setIsEditing(false);
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
                                    // selectedItems={getComponentIds(client.components)}
                                    entity={client.name}
                                    onToggle={onComponentToggle}
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
    const actionName = 'Action in klienter id';

    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const clientName = getRequestParam(params.id, 'id');
    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);
    const updateType = formData.get('isChecked') as string;
    const componentName = formData.get('componentName') as string;
    let response = null;

    let apiResponse;
    let updateResponse;
    switch (actionType) {
        case 'UPDATE_CLIENT':
            apiResponse = await ClientApi.updateClient(
                clientName,
                formData.get('shortDescription') as string,
                formData.get('note') as string,
                orgName
            );
            response = handleApiResponse(apiResponse, 'Klient oppdatert med suksess.');
            break;
        case 'DELETE_CLIENT':
            const clientId = formData.get('clientId') as string;
            apiResponse = await ClientApi.deleteClient(clientId, orgName);
            return redirect(`/klienter?deleted=${clientId}`);
        case 'UPDATE_COMPONENT_IN_CLIENT':
            updateResponse = await ClientApi.updateComponentInClient(
                componentName,
                clientName,
                orgName,
                updateType
            );
            if (updateType === 'true')
                response = handleApiResponse(updateResponse, 'Komponent lagt til klienter');
            else
                response = handleApiResponse(
                    updateResponse,
                    'Komponenten fjernet fra klienter',
                    'warning'
                );
            break;
        case 'UPDATE_PASSWORD':
            updateResponse = await ClientApi.setPassword(
                formData.get('entityName') as string,
                formData.get('password') as string,
                orgName
            );
            response = handleApiResponse(updateResponse, 'Klienter password oppdatert');
            break;
        case 'GET_SECRET':
            updateResponse = await ClientApi.getOpenIdSecret(
                formData.get('entityName') as string,
                orgName
            );
            return json({
                clientSecret: updateResponse,
                message: 'Klienthemmeligheten ble hentet',
                variant: 'success',
            });

        default:
            return json({
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            });
    }
    return response;
}
