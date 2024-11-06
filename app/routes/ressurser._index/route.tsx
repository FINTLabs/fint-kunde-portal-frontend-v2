import {
    type ActionFunctionArgs,
    type LoaderFunction,
    type MetaFunction,
    redirect,
} from '@remix-run/node';
import { LayersIcon, PlusIcon } from '@navikt/aksel-icons';
import { json, useFetcher, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import { IAsset, IPartialAsset } from '~/types/Asset';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { BodyLong, Box, Button, HStack, VStack } from '@navikt/ds-react';
import CreateForm from '~/routes/ressurser._index/CreateForm';
import AssetsTable from '~/routes/ressurser._index/ResourcesTable';
import React, { useState } from 'react';
import useAlerts from '~/components/useAlerts';
import AlertManager from '~/components/AlertManager';
import { IFetcherResponseData } from '~/types/FetcherResponseData';

interface IPageLoaderData {
    assets: IAsset[];
    orgName: string;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Ressurser' }, { name: 'description', content: 'Liste over ressurser' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const assets = await AssetApi.getAllAssets(orgName);

    return json({ assets: assets, orgName: orgName });
};

export default function Index() {
    const breadcrumbs = [{ name: 'Ressurser', link: '/ressurser' }];
    const { assets, orgName } = useLoaderData<IPageLoaderData>();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const deleteName = searchParams.get('deleted');
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state, deleteName);

    const handleClick = (id: string) => {
        navigate(`/ressurser/${id}`);
    };

    const handleCreate = () => {
        setIsCreating(true);
    };

    const handleCancel = () => {
        setIsCreating(false);
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <AlertManager alerts={alerts} />

            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />
                </VStack>
                <VStack>
                    <Button
                        className="float-right"
                        onClick={handleCreate}
                        icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>

            {!assets && (
                <Box padding="8" background="surface-info-moderate">
                    <BodyLong>Fant ingen ressurser</BodyLong>
                </Box>
            )}
            {isCreating ? (
                <CreateForm onCancel={handleCancel} orgName={orgName} />
            ) : (
                assets && <AssetsTable assets={assets} onRowClick={handleClick} />
            )}
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const orgName = await getSelectedOrganization(request);
    const newAsset: IPartialAsset = {
        assetId: name,
        name: name,
        description,
    };

    const response = await AssetApi.createAsset(newAsset, orgName);
    return redirect(`/ressurser/${response.name}`);
}
