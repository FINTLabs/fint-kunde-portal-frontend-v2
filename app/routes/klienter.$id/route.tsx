import React, { useState } from 'react';
import { json, useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientDetails from '~/routes/klienter.$id/ClientDetails';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
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

// @ts-ignore
export async function loader({ request, params }: ActionFunctionArgs) {
    const orgName = await getSelectedOrganization(request);
    const id = params.id || '';

    try {
        const client = await ClientApi.getClientById(orgName, id);
        const components = await ComponentApi.getAllComponents();

        return json({ client, components });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
}

export default function Index() {
    const { client, components } = useLoaderData<{ client: IClient; components: IComponent[] }>();
    const navigate = useNavigate();
    const selectedComponents = components
        .filter((component) => client.components.includes(component.dn))
        .map((component) => component.dn);

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

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={client.shortDescription} icon={TokenIcon} />

            <HGrid columns="50px auto">
                <Box>
                    <Button
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/klienter`)}></Button>
                </Box>

                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
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
                        passord={passord}
                        ressourceIds={client.assetId}
                        clientId={client.clientId}
                        clientSecret={clientSecret}
                        allDetails={allDetails}
                    />

                    <Divider className="pt-3" />

                    <Heading size={'medium'}>Komponenter</Heading>
                    <ComponentsTable
                        items={components}
                        selectedItems={selectedComponents}
                        columns={2}
                    />
                </Box>
            </HGrid>
        </>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    // const name = params.name;

    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);

    const actionType = formData.get('type') as string;
    if (actionType === 'Passord') {
        const response = 'Implement me. What is the API CALL?';
        return response;
    } else {
        const response = 'Implement me. What is the API call?';
        // const response = await fetchClientSecret(name, orgName);
        return response;
    }
}
