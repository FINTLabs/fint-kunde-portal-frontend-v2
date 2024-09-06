import { ArrowLeftIcon, LayersIcon } from '@navikt/aksel-icons';
import { json, useFetcher, useLoaderData, useNavigate, useParams } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AssetApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { Alert, Box, Button, HGrid } from '@navikt/ds-react';
import { GeneralDetailView } from './GeneralDetailView';
import { IAdapter, IFetcherResponseData } from '~/types/types';
import AdapterAPI from '~/api/AdapterApi';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import { DeleteModal } from '~/components/shared/DeleteModal';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import React, { useEffect } from 'react';
import TabsComponent from '~/routes/ressurser._index/TabsComponent';

type LoaderData = {
    adapters: IAdapter[];
    asset: IAsset;
    clients: IClient[];
};

export const meta: MetaFunction = () => {
    return [
        { title: 'Ressurser' },
        { name: 'description', content: 'Liste over ressurser._index' },
    ];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const id = params.id || '';

    try {
        const orgName = await getSelectedOrganization(request);
        const asset = await AssetApi.getAssetById(orgName, id);
        const adapters = await AdapterAPI.getAdapters(orgName);
        const clients = await ClientApi.getClients(orgName);

        return json({ asset: asset, adapters: adapters, clients: clients });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { adapters, asset, clients } = useLoaderData<LoaderData>();
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);

    const breadcrumbs = [
        { name: 'Ressurser', link: '/ressurser' },
        { name: `${id}`, link: `/ressurser/${id}` },
    ];

    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    const managedAdapters = adapters.filter((adapter) => adapter.managed);
    const unmanagedAdapters = adapters.filter((adapter) => !adapter.managed);

    const manangedClients = clients.filter((client) => client.managed);
    const unmanangedClients = clients.filter((client) => !client.managed);

    function onAssetUpdate(description: string) {
        const formData = {
            assetId: asset.assetId,
            assetDescription: description,
            assetName: asset.name,
            actionType: 'UPDATE',
        };
        fetcher.submit(formData, { method: 'post', action: `/ressurser/${asset.name}` });
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

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />

            {actionData && show && (
                <Alert
                    variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    onClose={() => setShow(false)}>
                    {actionData.message || 'Content'}
                </Alert>
            )}

            <HGrid gap="2" align={'start'}>
                <Box>
                    <Button
                        className="relative h-12 w-12 top-2 right-14"
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/ressurser`)}
                    />
                </Box>

                <Box
                    className="w-full relative bottom-12"
                    padding="6"
                    borderRadius="large"
                    shadow="small">
                    <HGrid gap="2" align={'start'}>
                        <GeneralDetailView asset={asset} onSave={onAssetUpdate} />

                        <TabsComponent
                            asset={asset}
                            managedAdapters={managedAdapters}
                            unmanagedAdapters={unmanagedAdapters}
                            managedClients={manangedClients}
                            unmanagedClients={unmanangedClients}
                            onAdapterSwitchChange={onAdapterSwitchChange}
                            onClientSwitchChange={onClientSwitchChange}
                        />
                        <DeleteModal
                            title="Slett ressurs"
                            bodyText="Er du sikker på at du vil slette denne ressursen?"
                            action="delete"
                        />
                    </HGrid>
                </Box>
            </HGrid>
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const selectedOrg = await getSelectedOrganization(request);

    const handleApiResponse = (apiResponse: Response, successMessage: string) => {
        if (apiResponse.ok) {
            return {
                message: successMessage,
                variant: 'success',
                show: true,
            };
        } else {
            return {
                message: `Error updating. More info: Status: ${apiResponse.status}. StatusText: ${apiResponse.statusText}`,
                variant: 'error',
                show: true,
            };
        }
    };
    let response;
    let updateResponse;
    switch (actionType) {
        case 'UPDATE':
            updateResponse = await AssetApi.updateAsset(
                {
                    name: formData.get('assetName') as string,
                    assetId: formData.get('assetId') as string,
                    description: formData.get('assetDescription') as string,
                },
                selectedOrg
            );
            response = handleApiResponse(updateResponse, 'Ressurser oppdatert');
            break;
        case 'UPDATE_ADAPTER':
            updateResponse = await AssetApi.updateAdapterInAsset(
                formData.get('adapterName') as string,
                formData.get('assetName') as string,
                selectedOrg,
                formData.get('updateType') as string
            );
            response = handleApiResponse(
                updateResponse,
                `Adapter oppdatert: ${formData.get('adapterName')}`
            );
            break;
        case 'UPDATE_CLIENT':
            updateResponse = await AssetApi.updateClientInAsset(
                formData.get('clientName') as string,
                formData.get('assetName') as string,
                selectedOrg,
                formData.get('updateType') as string
            );
            response = handleApiResponse(
                updateResponse,
                `Klienter oppdatert: ${formData.get('clientName')}`
            );
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
