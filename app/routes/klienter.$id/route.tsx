import { useState } from 'react';
import { json, useFetcher, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientDetails from '~/routes/klienter.$id/ClientDetails';
import type { ActionFunctionArgs } from '@remix-run/node';
import ClientApi from '~/api/ClientApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, FloppydiskIcon, PencilIcon, TokenIcon } from '@navikt/aksel-icons';
import { Box, Button, Heading, HGrid, HStack, Spacer } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentApi from '~/api/ComponentApi';
import { IComponent } from '~/types/Component';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import Autentisering from '~/components/shared/Autentisering';
import { AutentiseringDetail } from '~/types/AutentinseringDetail';
import { FETCHER_CLIENT_SECRET_KEY, FETCHER_PASSORD_KEY } from '../adapter.$name/constants';
import { DeleteModal } from '~/components/shared/DeleteModal';
import { getFormData, getRequestParam } from '~/utils/requestUtils';
import ComponentSelector from '~/components/shared/ComponentSelector';
import { getComponentIds } from '~/utils/helper';

export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    try {
        const client = await ClientApi.getClientById(orgName, id);
        const components = await ComponentApi.getOrganisationComponents(orgName);

        return json({ client, components });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
}

export default function Index() {
    const { client, components } = useLoaderData<{ client: IClient; components: IComponent[] }>();
    const navigate = useNavigate();
    const selectedComponents = getComponentIds(client.components);

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

                    <ComponentSelector
                        items={components}
                        selectedItems={selectedComponents}
                        clientName={client.name}
                        toggle={(name, isChecked) => {
                            submit(
                                {
                                    componentName: name,
                                    updateType: isChecked ? 'add' : 'remove',
                                    actionType: 'UPDATE_COMPONONENT_IN_CLIENT',
                                },
                                {
                                    method: 'post',
                                }
                            );
                        }}
                    />
                    {/* <Heading size={'medium'} spacing>
                        Komponenter tilknyttet
                    </Heading>
                    <ComponentsTable
                        items={components}
                        selectedItems={selectedComponents}
                        toggle={(name, isChecked) => {
                            submit(
                                {
                                    componentName: name,
                                    updateType: isChecked ? 'add' : 'remove',
                                    actionType: 'UPDATE_COMPONONENT_IN_CLIENT',
                                },
                                {
                                    method: 'post',
                                }
                            );
                        }}
                        columns={2}
                    /> */}
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
    // const name = params.name;
    const actionName = 'Action in Klienter.$id';

    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    // console.log(formData);

    const clientName = getRequestParam(params.id, 'id');

    // console.log(clientName);
    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);

    let response = null;

    switch (actionType) {
        case 'UPDATE_COMPONONENT_IN_CLIENT':
            const updateType = getFormData(formData.get('updateType'), 'updateType', actionName);
            const componentName = getFormData(
                formData.get('componentName'),
                'componentName',
                actionName
            );
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
