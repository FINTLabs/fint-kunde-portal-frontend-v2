import { type LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import React from 'react';
import { json, useLoaderData, useNavigate } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import ClientTable from '~/routes/klienter._index/ClientTable';
import { IAsset } from '~/types/Asset';
import { getSession } from '~/utils/session';
import { IUserSession } from '~/types/types';
import { getSelectedOprganization } from '~/utils/selectedOrganization';
import { Box, HStack, VStack, Button, Heading } from '@navikt/ds-react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import Autentisering from '~/components/shared/Autentisering';
import { DeleteAdapter } from '../adapter.$name/DeleteAdapter';
import ComponentsTable from '../komponenter._index/ComponentsTable';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { DetailView } from './DetailView';

export const meta: MetaFunction = () => {
    return [
        { title: 'Ressurser' },
        { name: 'description', content: 'Liste over ressurser._index' },
    ];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const id = params.id || '';

    try {
        const orgName = await getSelectedOprganization(request);
        const assetData = await AssetApi.getAssetById(orgName, id);
        return json(assetData);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter._index' }];
    const assetData = useLoaderData<IAsset>();
    const navigate = useNavigate();

    console.log(assetData);
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />
            {/* <ClientTable clients={assetData.clients} /> */}

            <Box padding={'2'}>
                <HStack>
                    <VStack>
                        <Button
                            icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                            variant="tertiary"
                            onClick={() => navigate(`/adaptere`)}></Button>
                    </VStack>
                    <VStack className="flex flex-grow">
                        <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                            <VStack gap="5">
                                <DetailView asset={assetData} />
                            </VStack>
                        </Box>
                    </VStack>
                </HStack>
            </Box>
        </>
    );
}
