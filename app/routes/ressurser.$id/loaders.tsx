import { LoaderFunctionArgs } from 'react-router';

import AdapterAPI from '~/api/AdapterApi';
import AssetApi from '~/api/AssetApi';
import ClientApi from '~/api/ClientApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const id = params.id || '';

    const orgName = await getSelectedOrganization(request);
    const asset = await AssetApi.getAssetById(orgName, id);
    const adapters = await AdapterAPI.getAdapters(orgName);
    const clients = await ClientApi.getClients(orgName);
    const assets = await AssetApi.getAllAssets(orgName);

    return Response.json({
        asset: asset.data,
        adapters: adapters.data,
        clients: clients.data,
        assets: assets.data,
    });
};
