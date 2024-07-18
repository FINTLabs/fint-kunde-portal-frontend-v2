import { type LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import { json, useLoaderData, useNavigate, useParams } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOprganization } from '~/utils/selectedOrganization';
import { Box, HStack, VStack } from '@navikt/ds-react';
import { GeneralDetailView } from './GeneralDetailView';
import { BackButton } from '~/components/shared/BackButton';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import Autentisering from '~/components/shared/Autentisering';
import AdapterSelector from './AdapterSelector';
import { IAdapter } from '~/types/types';
import AdapterAPI from '~/api/AdapterApi';

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
        const asset = await AssetApi.getAssetById(orgName, id);
        const adapters = await AdapterAPI.getAdapters(orgName);

        return json({ asset: asset, adapters: adapters });
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

    const { adapters, asset } = useLoaderData<{ adapters: IAdapter[]; asset: IAsset }>();

    console.log(asset);
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />
            {/* <ClientTable clients={assetData.clients} /> */}

            <Box padding={'2'}>
                <HStack>
                    <VStack>
                        <BackButton to={`/ressurser`} />
                    </VStack>
                    <VStack className="flex flex-grow">
                        <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                            <VStack gap="5">
                                <GeneralDetailView asset={asset} />
                                <Divider className="pt-3" />
                                {/* Adapters list */}
                                <AdapterSelector items={adapters} selectedItems={asset.adapters} />
                                {/* Klienter list */}
                            </VStack>
                        </Box>
                    </VStack>
                </HStack>
            </Box>
        </>
    );
}
