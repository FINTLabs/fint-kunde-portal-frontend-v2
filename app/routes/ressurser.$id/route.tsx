import { type LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import { json, useLoaderData, useParams } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { Box, HGrid, HStack, VStack } from '@navikt/ds-react';
import { GeneralDetailView } from './GeneralDetailView';
import { BackButton } from '~/components/shared/BackButton';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import AdapterSelector from './AdapterSelector';
import { IAdapter } from '~/types/types';
import AdapterAPI from '~/api/AdapterApi';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import ClientSelector from './ClientSelector';
import { DeleteRessurs } from './DeleteRessurs';
import { DeleteModal } from '~/components/shared/DeleteModal';

type LoaderData = {
    adapters: IAdapter[];
    asset: IAsset;
    clients: IClient[];
};
export const meta: MetaFunction = () => {
    return [
        { title: 'Ressurser' },
        { name: 'description', content: 'Liste over ressurser._index' },
    ];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const id = params.id || '';

    try {
        const orgName = await getSelectedOrganization(request);
        const asset = await AssetApi.getAssetById(orgName, id);
        const adapters = await AdapterAPI.getAdapters(orgName);
        const clients = await ClientApi.getClients(orgName);

        return json({ asset: asset, adapters: adapters, clients: clients });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const { id } = useParams();

    const breadcrumbs = [
        { name: 'Ressurser', link: '/ressurser' },
        { name: `${id}`, link: `/ressurser/${id}` },
    ];

    const { adapters, asset, clients } = useLoaderData<LoaderData>();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />
            {/* <ClientTable clients={assetData.clients} /> */}

            <Box padding={'2'}>
                <HStack>
                    <HGrid gap="2" align={'start'}>
                        <BackButton
                            to={`/ressurser`}
                            className="relative h-12 w-12 top-2 right-14"
                        />

                        <VStack className="flex flex-grow relative bottom-12">
                            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                                <VStack gap="5">
                                    <GeneralDetailView asset={asset} />
                                    <Divider className="pt-3" />
                                    <AdapterSelector
                                        items={adapters}
                                        selectedItems={asset.adapters.map((a) => {
                                            const match = a.match(/cn=([^,]+)/);
                                            return match ? match[1] : '';
                                        })}
                                    />
                                    <ClientSelector
                                        items={clients}
                                        selectedItems={asset.clients.map((a) => {
                                            const match = a.match(/cn=([^,]+)/);
                                            return match ? match[1] : '';
                                        })}
                                    />
                                    <DeleteModal
                                        title="Slett ressurs"
                                        bodyText="Er du sikker på at du vil slette denne ressursen?"
                                        action="delete"
                                    />
                                </VStack>
                            </Box>
                        </VStack>
                    </HGrid>
                </HStack>
            </Box>
        </>
    );
}
