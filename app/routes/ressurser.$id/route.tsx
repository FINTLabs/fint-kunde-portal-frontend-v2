import { LayersIcon } from '@navikt/aksel-icons';
import { useFetcher, useLoaderData, useParams } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { IAsset } from '~/types/Asset';
import { Alert, Box, HGrid, VStack } from '@navikt/ds-react';
import { IClient } from '~/types/Clients';
import { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import React from 'react';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { IAdapter } from '~/types/Adapter';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { DetailsView } from '~/routes/ressurser.$id/DetailsView';
import { BackButton } from '~/components/shared/BackButton';
import TabsComponent from '~/routes/ressurser.$id/TabsComponent';
import { handleAssetAction } from '~/routes/ressurser.$id/actions';
import { loader } from './loaders';

export const meta: MetaFunction = () => {
    return [{ title: 'Ressurser' }, { name: 'description', content: 'Liste over ressurser' }];
};

type LoaderData = {
    adapters: IAdapter[];
    asset: IAsset;
    clients: IClient[];
    assets: IAsset[];
};

export { loader };

export const action = async (args: ActionFunctionArgs) => handleAssetAction(args);

export default function Index() {
    const { id } = useParams();
    const { adapters, asset, clients, assets } = useLoaderData<LoaderData>();
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const { alerts } = useAlerts(actionData, fetcher.state);

    const breadcrumbs = [
        { name: 'Ressurser', link: '/ressurser' },
        { name: `${id}`, link: `/ressurser/${id}` },
    ];

    const unmanagedAdapters = adapters
        .filter((adapter) => !adapter.managed)
        .sort((a, b) => a.name.localeCompare(b.name));

    const unmanagedClients = clients
        .filter((client) => !client.managed)
        .sort((a, b) => a.name.localeCompare(b.name));

    function handleUpdate(formData: FormData) {
        formData.append('assetId', asset.assetId);
        formData.append('actionType', 'UPDATE');
        fetcher.submit(formData, {
            method: 'post',
        });
    }

    const assetList = Array.isArray(assets) ? assets : [];
    const primaryAsset = assetList.find((asset) => asset.primaryAsset) || { name: '' };

    function onAdapterSwitchChange(adapterName: string, isChecked: boolean) {
        const formData = {
            adapterName: adapterName,
            assetName: asset.name,
            updateType: isChecked ? 'add' : 'remove',
            actionType: 'UPDATE_ADAPTER',
        };
        fetcher.submit(formData, { method: 'post', action: `/ressurser/${asset.name}` });
    }

    function onClientSwitchChange(clientName: string, isChecked: boolean) {
        const formData = {
            clientName: clientName,
            assetName: asset.name,
            updateType: isChecked ? 'add' : 'remove',
            actionType: 'UPDATE_CLIENT',
            primaryAssetDN: primaryAsset.name,
        };
        fetcher.submit(formData, { method: 'post', action: `/ressurser/${asset.name}` });
    }

    const handleDelete = () => {
        const formData = new FormData();
        formData.append('actionType', 'DELETE');
        formData.append('assetName', asset.name);
        fetcher.submit(formData, { method: 'post' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="ressurser" />

            <AlertManager alerts={alerts} />

            {!asset ? (
                <Alert variant="warning">Det finnes ingen ressurser</Alert>
            ) : (
                <HGrid gap="2" align={'start'}>
                    <BackButton to={`/ressurser`} className="relative h-12 w-12 top-2 right-14" />
                    <Box
                        className="w-full relative bottom-12"
                        padding="6"
                        borderRadius="large"
                        shadow="small">
                        <VStack gap="5">
                            <DetailsView
                                asset={asset}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />

                            <TabsComponent
                                asset={asset}
                                unmanagedAdapters={unmanagedAdapters}
                                unmanagedClients={unmanagedClients}
                                onAdapterSwitchChange={onAdapterSwitchChange}
                                onClientSwitchChange={onClientSwitchChange}
                            />
                        </VStack>
                    </Box>
                </HGrid>
            )}
        </>
    );
}
