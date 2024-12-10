import {
    type ActionFunctionArgs,
    type LoaderFunction,
    type MetaFunction,
    redirect,
} from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import { useFetcher, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import { IAsset, IPartialAsset } from '~/types/Asset';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { BodyLong, Box } from '@navikt/ds-react';
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
    const assetsResponse = await AssetApi.getAllAssets(orgName);

    if (!assetsResponse.success) {
        throw new Error(`Kunne ikke hente ressurser for organisasjonen: ${orgName}`);
    }

    const assets = assetsResponse.data || [];
    assets.sort((a: IAsset, b: IAsset) => a.name.localeCompare(b.name));

    return new Response(
        JSON.stringify({
            assets,
            orgName,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
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

    const handleClick = (id: string) => navigate(`/ressurser/${id}`);

    const handleCreate = () => setIsCreating(true);

    const handleCancel = () => setIsCreating(false);

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <AlertManager alerts={alerts} />

            <InternalPageHeader
                title={'Ressurser'}
                icon={LayersIcon}
                helpText="assets"
                onAddClick={handleCreate}
            />

            {!assets || assets.length === 0 ? (
                <Box padding="8">
                    <BodyLong>Fant ingen ressurser</BodyLong>
                </Box>
            ) : isCreating ? (
                <CreateForm onCancel={handleCancel} orgName={orgName} />
            ) : (
                <AssetsTable assets={assets} onRowClick={handleClick} />
            )}
        </>
    );
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const orgName = await getSelectedOrganization(request);
    const newAsset: IPartialAsset = {
        assetId: name,
        name,
        description,
    };

    const response = await AssetApi.createAsset(newAsset, orgName);

    if (!response.success) {
        return new Response(
            JSON.stringify({
                message: response.message || 'Operasjon mislyktes',
                variant: response.variant || 'error',
            }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } else {
        return redirect(`/ressurser/${response.data?.name}`);
    }
};
