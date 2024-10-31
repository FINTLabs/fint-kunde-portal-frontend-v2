import React, { useEffect, useState } from 'react';
import { json, useFetcher, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientDetails from '~/routes/klienter.$id/ClientDetails';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import ClientApi from '~/api/ClientApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, TokenIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, Heading, HGrid, HStack, Spacer } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentApi from '~/api/ComponentApi';
import { IComponent } from '~/types/Component';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { getFormData, getRequestParam } from '~/utils/requestUtils';
import { getComponentIds } from '~/utils/helper';
import ComponentList from '~/components/shared/ComponentList';
import FeaturesApi from '~/api/FeaturesApi';
import ComponentSelector from '~/components/shared/ComponentSelector';
import { IFetcherResponseData } from '~/types/types';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import { AuthTable } from '~/components/shared/AuthTable';
import { handleApiResponse } from '~/utils/handleApiResponse';
import ActionButtons from '~/components/shared/ActionButtons';
import logger from '~/utils/logger';

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
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);
    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    const submit = useSubmit();

    const handleSave = () => {
        const formData = new FormData();
        formData.append('shortDescription', shortDescription);
        formData.append('note', note);
        formData.append('actionType', 'UPDATE_CLIENT');

        fetcher.submit(formData, {
            method: 'post',
            action: `/klienter/${client.name}`,
        });

        setIsEditing(false);
    };

    function onComponentToggle() {
        console.info('------- handle component checkbox');
    }

    const handleConfirmDelete = () => {
        console.info('Deleting client');

        setShow(false);
        const formData = new FormData();
        formData.append('actionType', 'DELETE_CLIENT');
        formData.append('clientId', client.name);
        fetcher.submit(formData, { method: 'post' });
    };
    const handleCancel = () => {
        // Reset values if canceled
        setShortDescription(client.shortDescription);
        setNote(client.note);
        setIsEditing(false);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={client.shortDescription} icon={TokenIcon} />

            {actionData && show && (
                <Alert
                    variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    onClose={() => setShow(false)}>
                    {actionData.message || 'Content'}
                </Alert>
            )}

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
                                actionName="clientName"
                            />
                            <Divider className="pt-10" />
                        </>
                    )}

                    <Divider className="pt-10" />

                    <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>
                    {hasAccessControl ? (
                        <ComponentList
                            accessList={access}
                            // selectedItems={getComponentIds(client.components)}
                            entity={client.name}
                            onToggle={onComponentToggle}
                        />
                    ) : (
                        <ComponentSelector
                            items={components}
                            adapterName={client.name}
                            selectedItems={getComponentIds(client.components)}
                            toggle={(name, isChecked) => {
                                submit(
                                    {
                                        componentName: name,
                                        updateType: isChecked ? 'add' : 'remove',
                                        actionType: 'UPDATE_COMPONENT_IN_ADAPTER',
                                    },
                                    {
                                        method: 'POST',
                                        // action: 'update',
                                        navigate: false,
                                    }
                                );
                            }}
                        />
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
    const updateType = formData.get('updateType') as string;
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
        case 'UPDATE_COMPONENT_IN_ADAPTER':
            response = await ClientApi.updateComponentInClient(
                componentName,
                clientName,
                orgName,
                updateType
            );
            return json({ ok: response.status === 204 });
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
                formData.get('clientName') as string,
                orgName
            );
            return json({
                clientSecret: updateResponse,
                message: 'Client secret fetched successfully',
                variant: 'success',
                show: true,
            });

        default:
            return null;
    }
    return response;
}
