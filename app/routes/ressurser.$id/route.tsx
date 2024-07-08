import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
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

export const meta: MetaFunction = () => {
    return [
        { title: 'Ressurser' },
        { name: 'description', content: 'Liste over ressurser._index' },
    ];
};

export const loader = async ({ params }: LoaderFunctionArgs, request: Request) => {
    const id = params.id || '';

    try {
        const session = await getSession(request.headers.get('Cookie'));
        const userSession = session.get('user-session') as IUserSession;
        if (!userSession?.selectedOrganization?.name) {
            return new Response('Selected organization not found', { status: 400 });
        }
        const assetData = await AssetApi.getAssetById(userSession.selectedOrganization.name, id);

        return json(assetData);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter._index' }];
    const assetData = useLoaderData<IAsset>();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Ressurser'}
                icon={LayersIcon}
                helpText="assets"
                hideBorder={true}
            />
            <ClientTable clients={assetData.clients} />
        </>
    );
}
