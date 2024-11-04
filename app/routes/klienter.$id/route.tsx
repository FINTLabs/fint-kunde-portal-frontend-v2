import React, { useState } from 'react';
import { json, useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientDetails from '~/routes/klienter.$id/ClientDetails';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import ClientApi from '~/api/ClientApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, TokenIcon } from '@navikt/aksel-icons';
import { Box, Button, Heading, HGrid, HStack, Spacer } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentApi from '~/api/ComponentApi';
import { IComponent } from '~/types/Component';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { getFormData, getRequestParam } from '~/utils/requestUtils';
import { getComponentIds } from '~/utils/helper';
import ComponentList from '~/components/shared/ComponentList';
import FeaturesApi from '~/api/FeaturesApi';
import { IFetcherResponseData } from '~/types/types';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import { AuthTable } from '~/components/shared/AuthTable';
import { handleApiResponse } from '~/utils/handleApiResponse';
import ActionButtons from '~/components/shared/ActionButtons';
import logger from '~/utils/logger';
import AlertManager from '~/components/AlertManager';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import useAlerts from '~/components/useAlerts';

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
    // const selectedComponents = getComponentIds(client.components);
    const hasAccessControl = features['access-controll-new'];

    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: client.name, link: `/klienter/${client.name}` },
    ];

    const [isEditing, setIsEditing] = useState(false);
    const [shortDescription, setShortDescription] = useState(client.shortDescription);
    const [note, setNote] = useState(client.note);
    const fetcher = useFetcher();
    const actionData = fetcher.data as IExtendedFetcherResponseData;
    const { alerts, addAlert, removeAlert } = useAlerts(actionData, fetcher.state);

    const handleSave = () => {
        const formData = new FormData();
        formData.append('shortDescription', shortDescription);
        formData.append('note', note);
        formData.append('actionType', 'UPDATE_CLIENT');

        fetcher.submit(formData, {
            method: 'post',
        });

        setIsEditing(false);
    };

    function onComponentToggle() {
        console.info('------- handle component checkbox');
    }

    const handleConfirmDelete = () => {
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
            <InternalPageHeader title={client.shortDescription} icon={TokenIcon} />
            <AlertManager alerts={alerts} />

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
                    <HStack>
                        <Heading size={'medium'}>Details</Heading>
                        <Spacer />
                        {!client.managed && (
                            <ActionButtons
                                isEditing={isEditing}
                                handleSave={handleSave}
                                handleCancel={handleCancel}
                                setIsEditing={setIsEditing}
                                handleConfirmDelete={handleConfirmDelete}
                                nameText={client.name}
                            />
                        )}
                    </HStack>

                    <ClientDetails
                        client={{ ...client, shortDescription, note }}
                        isEditing={isEditing}
                        onChangeShortDescription={setShortDescription}
                        onChangeNote={setNote}
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
    let isOk = false;
    switch (actionType) {
        case 'UPDATE_CLIENT':
            apiResponse = await ClientApi.updateClient(
                clientName,
                formData.get('shortDescription') as string,
                formData.get('note') as string,
                orgName
            );
            isOk = apiResponse.status;
            return json({
                ok: isOk,
                show: true,
                message: apiResponse.ok
                    ? 'Klient oppdatert med suksess.'
                    : `Oppdatering av klient feilet. Mer info: Status: ${apiResponse.status}. StatusTekst: ${apiResponse.statusText}`,
                variant: isOk ? 'success' : 'error',
            });
        case 'DELETE_CLIENT':
            const clientId = formData.get('clientId') as string;
            apiResponse = await ClientApi.deleteClient(clientId, orgName);
            logger.debug(`delete client response: ${JSON.stringify(response)}`);
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
                    true
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
                show: true,
            });

        default:
            return null;
    }
    return response;
}
