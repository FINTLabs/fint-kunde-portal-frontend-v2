import { LayersIcon } from '@navikt/aksel-icons';
import { json, useFetcher, useLoaderData, useParams } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { Alert, Box, HGrid, VStack } from '@navikt/ds-react';
import AdapterAPI from '~/api/AdapterApi';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import React from 'react';
import { handleApiResponse } from '~/utils/handleApiResponse';
import AlertManager from '~/components/AlertManager';
import useAlerts from '~/components/useAlerts';
import { IAdapter } from '~/types/Adapter';
import { IFetcherResponseData } from '~/types/FetcherResponseData';
import { DetailsView } from '~/routes/ressurser.$id/DetailsView';
import { BackButton } from '~/components/shared/BackButton';
import TabsComponent from '~/routes/ressurser.$id/TabsComponent';
import { getRequestParam } from '~/utils/requestUtils';

type LoaderData = {
    adapters: IAdapter[];
    asset: IAsset;
    clients: IClient[];
};

export const meta: MetaFunction = () => {
    return [{ title: 'Ressurser' }, { name: 'description', content: 'Liste over ressurser' }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const id = params.id || '';

    try {
        const orgName = await getSelectedOrganization(request);
        const asset = await AssetApi.getAssetById(orgName, id);
        const adapters = await AdapterAPI.getAdapters(orgName);
        const clients = await ClientApi.getClients(orgName);

        return json({ asset: asset, adapters: adapters, clients: clients });
    } catch (err) {
        console.error('Error fetching data:', err as Error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const { id } = useParams();
    const { adapters, asset, clients } = useLoaderData<LoaderData>();
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
                    <BackButton to={`/adaptere`} className="relative h-12 w-12 top-2 right-14" />
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

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const selectedOrg = await getSelectedOrganization(request);
    const orgName = await getSelectedOrganization(request);
    const name = getRequestParam(params.id, 'id');

    let response;
    let updateResponse;
    switch (actionType) {
        case 'CREATE':
            updateResponse = await AssetApi.createAsset(
                {
                    name,
                    description: formData.get('assetDescription') as string,
                },
                selectedOrg
            );
            response = handleApiResponse(updateResponse, 'Ressurser opprettet');
            break;
        case 'UPDATE':
            updateResponse = await AssetApi.updateAsset(
                {
                    name,
                    assetId: formData.get('assetId') as string,
                    description: formData.get('assetDescription') as string,
                },
                selectedOrg
            );
            response = handleApiResponse(updateResponse, 'Ressurser oppdatert');
            break;
        case 'DELETE':
            const assetName = formData.get('assetName') as string;
            updateResponse = await AssetApi.deleteAsset(assetName, orgName);
            if (updateResponse) {
                return redirect(`/ressurser?deleted=${assetName}`);
            } else {
                return json({
                    status: updateResponse.status,
                    error: 'Kunne ikke slette elementet',
                });
            }
        case 'UPDATE_ADAPTER':
            const updateType = formData.get('updateType') as string;
            const message =
                updateType === 'add'
                    ? `Adapter lagt til: ${formData.get('adapterName')}`
                    : `Adapter fjernet: ${formData.get('adapterName')}`;

            updateResponse = await AssetApi.updateAdapterInAsset(
                formData.get('adapterName') as string,
                formData.get('assetName') as string,
                selectedOrg,
                updateType
            );

            const variant = updateType === 'add' ? 'success' : 'warning';
            response = handleApiResponse(updateResponse, message, variant);
            break;

        case 'UPDATE_CLIENT':
            const updateTypeClient = formData.get('updateType') as string;
            const clientMessage =
                updateTypeClient === 'add'
                    ? `Klient lagt til: ${formData.get('clientName')}`
                    : `Klient fjernet: ${formData.get('clientName')}`;

            updateResponse = await AssetApi.updateClientInAsset(
                formData.get('clientName') as string,
                formData.get('assetName') as string,
                selectedOrg,
                updateTypeClient
            );

            const clientRemoved = updateTypeClient === 'add' ? 'success' : 'warning';
            response = handleApiResponse(updateResponse, clientMessage, clientRemoved);
            break;

        default:
            return json({
                show: true,
                message: `Unknown action type '${actionType}'`,
                variant: 'error',
            });
    }

    return json(response);
}
