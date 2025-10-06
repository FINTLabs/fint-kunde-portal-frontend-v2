import type { LoaderFunction } from 'react-router';

import AssetApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const assetsResponse = await AssetApi.getAllAssets(orgName);

    if (!assetsResponse.success) {
        throw new Error(`Kunne ikke hente ressurser for organisasjonen: ${orgName}`);
    }

    const assets = assetsResponse.data || [];
    assets.sort((a: IAsset, b: IAsset) => a.name.localeCompare(b.name));

    return Response.json({
        assets,
        orgName,
    });
};
