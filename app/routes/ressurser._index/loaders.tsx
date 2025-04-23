import type { LoaderFunction } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import AssetApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const assetsResponse = await AssetApi.getAllAssets(orgName);

    if (!assetsResponse.success) {
        throw new Error(`Kunne ikke hente ressurser for organisasjonen: ${orgName}`);
    }

    const assets = assetsResponse.data || [];
    assets.sort((a: IAsset, b: IAsset) => a.name.localeCompare(b.name));

    return new Response(
        JSON.stringify({
            assets,
            orgName,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
};
