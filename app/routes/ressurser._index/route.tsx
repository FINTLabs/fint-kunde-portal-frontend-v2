import { type ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import { useFetcher, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { IAsset } from '~/types/Asset';
import { BodyLong, Box } from '@navikt/ds-react';
import CreateForm from '~/routes/ressurser._index/CreateForm';
import AssetsTable from '~/routes/ressurser._index/ResourcesTable';
import React, { useState } from 'react';
import useAlerts from '~/components/useAlerts';
import AlertManager from '~/components/AlertManager';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { handleAssetIndexAction } from '~/routes/ressurser._index/actions';
import { loader } from './loaders';

interface IPageLoaderData {
    assets: IAsset[];
    orgName: string;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Ressurser' }, { name: 'description', content: 'Liste over ressurser' }];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleAssetIndexAction(args);

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
