import { MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import React from 'react';
import { json, useLoaderData } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AccessApi from '~/api/AssetApi';

export const meta: MetaFunction = () => {
    return [
        { title: 'Ressurser' },
        { name: 'description', content: 'Liste over ressurser._index' },
    ];
};

export const loader = async () => {
    try {
        const components = await AccessApi.getAllAssets('fintlabs_no');
        return json(components);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter._index' }];
    const assests = useLoaderData<IAccess[]>();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Ressurser'}
                icon={LayersIcon}
                helpText="assets"
                hideBorder={true}
            />

            {assests.map((asset) => (
                <div key={asset.dn}>
                    <h2>{asset.name}</h2>
                    <p>{asset.description}</p>
                </div>
            ))}
        </>
    );
}
