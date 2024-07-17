import { type LoaderFunction, type MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import React from 'react';
import { json, useLoaderData } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AccessApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOprganization } from '~/utils/selectedOrganization';

export const meta: MetaFunction = () => {
    return [
        { title: 'Ressurser' },
        { name: 'description', content: 'Liste over ressurser._index' },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const orgName = await getSelectedOprganization(request);
        const assets = await AccessApi.getAllAssets(orgName);
        return json(assets);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'ressurser', link: '/ressurser._index' }];
    const assets = useLoaderData<IAsset[]>();
    console.log(assets);
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />

            {assets.map((asset) => (
                <div key={asset.dn}>
                    <h2>{asset.name}</h2>
                    <p>{asset.description}</p>
                </div>
            ))}
        </>
    );
}
