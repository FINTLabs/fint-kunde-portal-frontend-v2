import type { LoaderFunction } from 'react-router';

import AssetApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export const loader: LoaderFunction = async ({ request }) => {
    const selectedOrgName = await getSelectedOrganization(request);
    const assetsResponse = await AssetApi.getAllAssets(selectedOrgName);
    const primaryAssetResponse = await AssetApi.getPrimaryAsset(selectedOrgName);

    if (!assetsResponse.success) {
        throw new Error(`Kunne ikke hente ressurser for organisasjonen: ${selectedOrgName}`);
    }

    const assets = assetsResponse.data || [];
    assets.sort((a: IAsset, b: IAsset) => a.name.localeCompare(b.name));

    return Response.json({
        assets,
        primaryAsset: primaryAssetResponse.data,
    });
};
