import React, { useEffect, useState } from 'react';
import { json, useFetcher, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientDetails from '~/routes/klienter.$id/ClientDetails';
import type { ActionFunctionArgs } from '@remix-run/node';
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
import ComponentList from '~/routes/accesscontrol.$id/ComponentList';
import FeaturesApi from '~/api/FeaturesApi';
import ComponentSelector from '~/components/shared/ComponentSelector';
import { IFetcherResponseData } from '~/types/types';
import ClientActionButtons from '~/routes/klienter.$id/ClientActionButtons';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import { AuthTable } from '~/components/shared/AuthTable';
import AdapterApi from '~/api/AdapterApi';
import { handleApiResponse } from '~/utils/handleApiResponse';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    try {
        const client = await ClientApi.getClientById(orgName, id);
        const components = await ComponentApi.getOrganisationComponents(orgName);
        const features = await FeaturesApi.fetchFeatures();

        let access;
        if (id && features['access-controll-new']) {
            access = await AccessApi.getClientorAdapterAccess(id);
        }

        return json({ client, components, features, access });
    } catch (err) {
        console.error('Error fetching data:', err as Error);
        throw new Response('Kunne ikke laste data. Vennligst prøv igjen senere.', { status: 404 });
    }
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

    // const passordFetcher = useFetcher({ key: FETCHER_PASSORD_KEY });
    // const clientSecretFetcher = useFetcher({ key: FETCHER_CLIENT_SECRET_KEY });

    // const clientSecret = clientSecretFetcher.data ? (clientSecretFetcher.data as string) : '';
    // const passord = passordFetcher.data ? (passordFetcher.data as string) : '';

    // const allDetails: AutentiseringDetail = {
    //     username: client.name,
    //     password: passord,
    //     clientId: client.clientId,
    //     openIdSecret: clientSecret,
    //     scope: 'fint-client',
    //     idpUri: 'https://idp.felleskomponent.no/nidp/oauth/nam/token',
    //     assetIds: client.assetId,
    // };
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
        submit(null, {
            method: 'POST',
            action: 'delete',
            navigate: false,
        });
        console.debug('Adapter deleted');
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
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
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
                        <ClientActionButtons
                            isEditing={isEditing}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            setIsEditing={setIsEditing}
                            clientManaged={client.managed}
                            handleConfirmDelete={handleConfirmDelete}
                        />
                    </HStack>

                    <ClientDetails
                        client={{ ...client, shortDescription, note }}
                        isEditing={isEditing}
                        onChangeShortDescription={setShortDescription}
                        onChangeNote={setNote}
                    />

                    <Divider className="pt-3" />
                    <Heading size={'medium'}>Autentisering</Heading>
                    <AuthTable
                        entity={client} // Client object
                        entityType="client" // Specify that it's for a client
                        actionName="clientName" // Use clientName in the form
                    />

                    {/*<Autentisering*/}
                    {/*    name={client.name}*/}
                    {/*    password={passord}*/}
                    {/*    resourceIds={client.assetId}*/}
                    {/*    clientId={client.clientId}*/}
                    {/*    clientSecret={clientSecret}*/}
                    {/*    allDetails={allDetails}*/}
                    {/*/>*/}

                    <Divider className="pt-10" />

                    <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>
                    {hasAccessControl ? (
                        <ComponentList
                            accessList={access}
                            // selectedItems={getComponentIds(client.components)}
                            clientName={client.name}
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

                    {/*<HGrid columns={3}>*/}
                    {/*    {!client.managed && (*/}
                    {/*        <DeleteModal*/}
                    {/*            title="Slett klient"*/}
                    {/*            bodyText="Er du sikker på at du vil slette denne klienten?"*/}
                    {/*            action="delete"*/}
                    {/*        />*/}
                    {/*    )}*/}
                    {/*</HGrid>*/}
                </Box>
            </HGrid>
        </>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    const actionName = 'Action in klienter.$id';

    const formData = await request.formData();
    console.error('--------------', formData.get('updateType'));
    const orgName = await getSelectedOrganization(request);
    const clientName = getRequestParam(params.id, 'id');
    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);
    const updateType = formData.get('updateType') as string;
    // const componentName = getFormData(formData.get('componentName'), 'componentName', actionName);
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
        case 'UPDATE_COMPONENT_IN_ADAPTER':
            response = await ClientApi.updateComponentInClient(
                componentName,
                clientName,
                orgName,
                updateType
            );
            return json({ ok: response.status === 204 });
        case 'UPDATE_PASSWORD':
            updateResponse = await AdapterApi.setPassword(
                formData.get('clientName') as string,
                formData.get('password') as string,
                orgName
            );
            response = handleApiResponse(updateResponse, 'Klienter oppdatert');
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
        // case 'Passord':
        //     return 'Not implemented';
        // case 'Klient Hemmelighet':
        //     response = await ClientApi.getOpenIdSecret(clientName, orgName);
        //     return response;
        default:
            return null;
        // return redirect(`/adapter/${adapterName}`);
    }
    // const type = formData.get('type') as string;
    // if (type === 'Passord') {
    //     const response = 'Implement me. What is the API CALL?';
    //     return response;
    // } else {
    //     const response = 'Implement me. What is the API call?';
    //     // const response = await fetchClientSecret(name, orgName);
    //     return response;
    // }
}
