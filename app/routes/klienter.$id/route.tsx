import { useState } from 'react';
import { json, useFetcher, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientDetails from '~/routes/klienter.$id/ClientDetails';
import type { ActionFunctionArgs } from '@remix-run/node';
import ClientApi from '~/api/ClientApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import {
    ArrowLeftIcon,
    FloppydiskIcon,
    PencilIcon,
    SealCheckmarkIcon,
    TokenIcon,
} from '@navikt/aksel-icons';
import { Box, Button, GuidePanel, Heading, HGrid, HStack, Spacer } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentApi from '~/api/ComponentApi';
import { IComponent } from '~/types/Component';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import Autentisering from '~/components/shared/Autentisering';
import { AutentiseringDetail } from '~/types/AutentinseringDetail';
import { FETCHER_CLIENT_SECRET_KEY, FETCHER_PASSORD_KEY } from '../adapter.$name/constants';
import { DeleteModal } from '~/components/shared/DeleteModal';
import { getFormData, getRequestParam } from '~/utils/requestUtils';
import { getComponentIds } from '~/utils/helper';
import ComponentList from '~/routes/accesscontrol.$id/ComponentList';
import FeaturesApi from '~/api/FeaturesApi';
import ComponentSelector from '~/components/shared/ComponentSelector';
import { error, info } from '~/utils/logger';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    try {
        const client = await ClientApi.getClientById(orgName, id);
        const components = await ComponentApi.getOrganisationComponents(orgName);
        const features = await FeaturesApi.fetchFeatures();

        return json({ client, components, features });
    } catch (err) {
        error('Error fetching data:', err as Error);
        throw new Response('Not Found', { status: 404 });
    }
}

export default function Index() {
    const { client, components, features } = useLoaderData<{
        client: IClient;
        components: IComponent[];
        features: Record<string, boolean>;
    }>();
    const navigate = useNavigate();
    // const selectedComponents = getComponentIds(client.components);
    const hasAccessControl = features['access-controll-new'];

    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: client.name, link: `/klienter/${client.name}` },
    ];

    const passordFetcher = useFetcher({ key: FETCHER_PASSORD_KEY });
    const clientSecretFetcher = useFetcher({ key: FETCHER_CLIENT_SECRET_KEY });

    const clientSecret = clientSecretFetcher.data ? (clientSecretFetcher.data as string) : '';
    const passord = passordFetcher.data ? (passordFetcher.data as string) : '';

    const allDetails: AutentiseringDetail = {
        username: client.name,
        password: passord,
        clientId: client.clientId,
        openIdSecret: clientSecret,
        scope: 'fint-client',
        idpUri: 'https://idp.felleskomponent.no/nidp/oauth/nam/token',
        assetIds: client.assetId,
    };
    const [isEditing, setIsEditing] = useState(false);

    const submit = useSubmit();

    function onComponentToggle() {
        info('------- handle component checkbox');
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={client.shortDescription} icon={TokenIcon} />

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
                        {isEditing ? (
                            <Button
                                icon={<FloppydiskIcon title="Rediger" />}
                                variant="tertiary"
                                onClick={() => setIsEditing(false)}
                            />
                        ) : (
                            <Button
                                disabled={client.managed}
                                icon={<PencilIcon title="Rediger" />}
                                variant="tertiary"
                                onClick={() => setIsEditing(true)}
                            />
                        )}
                    </HStack>

                    <ClientDetails client={client} isEditing={isEditing} />

                    <Divider className="pt-3" />

                    <Autentisering
                        name={client.name}
                        password={passord}
                        resourceIds={client.assetId}
                        clientId={client.clientId}
                        clientSecret={clientSecret}
                        allDetails={allDetails}
                    />

                    <Divider className="pt-10" />

                    <Heading size={'medium'}>Tilgangsstyring for Komponenter</Heading>
                    {hasAccessControl ? (
                        <ComponentList
                            items={components}
                            selectedItems={getComponentIds(client.components)}
                            clientName={client.name}
                            onToggle={onComponentToggle}
                        />
                    ) : (
                        <>
                            <GuidePanel
                                poster
                                illustration={
                                    <SealCheckmarkIcon title="a11y-title" fontSize="1.5rem" />
                                }>
                                Vi jobber for tiden med å utvikle et system som vil gjøre det mulig
                                for brukere å finjustere tilgangen til komponenter i klienter og
                                adaptere
                            </GuidePanel>
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
                        </>
                    )}

                    <HGrid columns={3}>
                        {!client.managed && (
                            <DeleteModal
                                title="Slett klient"
                                bodyText="Er du sikker på at du vil slette denne klienten?"
                                action="delete"
                            />
                        )}
                    </HGrid>
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
    const updateType = getFormData(formData.get('updateType'), 'updateType', actionName);
    const componentName = getFormData(formData.get('componentName'), 'componentName', actionName);
    let response = null;

    switch (actionType) {
        case 'UPDATE_COMPONENT_IN_ADAPTER':
            response = await ClientApi.updateComponentInClient(
                componentName,
                clientName,
                orgName,
                updateType
            );
            return json({ ok: response.status === 204 });
        case 'Passord':
            return 'Not implemented';
        case 'Klient Hemmelighet':
            response = await ClientApi.getOpenIdSecret(clientName, orgName);
            return response;
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
