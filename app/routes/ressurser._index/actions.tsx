import { redirect } from '@remix-run/node';
import AssetApi from '~/api/AssetApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IPartialAsset } from '~/types/Asset';

export async function handleAssetIndexAction({ request }: { request: Request }) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const orgName = await getSelectedOrganization(request);
    const newAsset: IPartialAsset = {
        assetId: name,
        name,
        description,
    };

    const response = await AssetApi.createAsset(newAsset, orgName);

    if (!response.success) {
        return new Response(
            JSON.stringify({
                message: response.message || 'Operasjon mislyktes',
                variant: response.variant || 'error',
            }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    return redirect(`/ressurser/${response.data?.name}`);
}
