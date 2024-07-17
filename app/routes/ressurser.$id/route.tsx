import { type LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import React from 'react';
import { json, useLoaderData } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import ClientTable from '~/routes/klienter._index/ClientTable';
import { IAsset } from '~/types/Asset';
import { getSession } from '~/utils/session';
import { IUserSession } from '~/types/types';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

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

    console.log(assetData);
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />
            {/* <ClientTable clients={assetData.clients} /> */}
        </>
    );
}
