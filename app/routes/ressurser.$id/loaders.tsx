import { LoaderFunctionArgs } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import AssetApi from '~/api/AssetApi';
import AdapterAPI from '~/api/AdapterApi';
import ClientApi from '~/api/ClientApi';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const id = params.id || '';

    const orgName = await getSelectedOrganization(request);
    const asset = await AssetApi.getAssetById(orgName, id);
    const adapters = await AdapterAPI.getAdapters(orgName);
    const clients = await ClientApi.getClients(orgName);
    const assets = await AssetApi.getAllAssets(orgName);

    return new Response(
        JSON.stringify({
            asset: asset.data,
            adapters: adapters.data,
            clients: clients.data,
            assets: assets.data,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
