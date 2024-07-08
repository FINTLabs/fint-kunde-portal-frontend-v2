import React from 'react';
import { json, useLoaderData, useNavigate } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientDetails from '~/routes/klienter.$id/ClientDetails';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import SecuritySection from '~/routes/klienter.$id/SecuritySection';
import type { LoaderFunctionArgs } from '@remix-run/node';
import ClientApi from '~/api/ClientApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, TokenIcon } from '@navikt/aksel-icons';
import { Box, Button, Heading, HGrid } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
// import { loader as componentLoader } from '../komponenter._index/route';
import ComponentApi from '~/api/ComponentApi';
import { IComponent } from '~/types/Component';

// @ts-ignore
export const loader = async ({ params }: LoaderFunctionArgs, request) => {
    const organisation = 'fintlabs_no'; // todo: Replace with actual organisation identifier
    const id = params.id || '';

    try {
        const client = await ClientApi.getClientById(organisation, id);
        // const componentLoaderResponse = await componentLoader();
        // const components = await componentLoaderResponse.json();
        const components = await ComponentApi.getAllComponents();

        return json({ client, components });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const { client, components } = useLoaderData<{ client: IClient; components: IComponent[] }>(); // Destructure client and components
    const navigate = useNavigate();

    const breadcrumbs = [
        { name: 'Klienter', link: '/klienter' },
        { name: client.name, link: `/klienter/${client.name}` },
    ];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={client.shortDescription}
                icon={TokenIcon}
                hideBorder={true}
            />

            <HGrid columns="50px auto">
                <Box>
                    <Button
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/klienter`)}></Button>
                </Box>

                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <Heading size={'medium'}>Deatails</Heading>
                    <ClientDetails client={client} />
                    <Divider className="pt-3" />

                    <Heading size={'medium'}>Security</Heading>
                    <SecuritySection client={client} />
                    <Divider className="pt-3" />

                    <Heading size={'medium'}>Komponenter</Heading>
                    <ComponentsTable
                        selectedComponents={client.components}
                        components={components}
                        columns={2}
                    />
                </Box>
            </HGrid>
        </>
    );
}
