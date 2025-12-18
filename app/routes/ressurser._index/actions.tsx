import { data, redirect } from 'react-router';

import AssetApi from '~/api/AssetApi';
import { IPartialAsset } from '~/types/Asset';

export async function handleAssetIndexAction({ request }: { request: Request }) {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const orgName = formData.get('orgName') as string;

    // ----- DEBUG
    // const actionType = formData.get('actionType') as string;
    // console.log('RESOURCE ACTION TYPE', actionType);
    // const orgName = await getSelectedOrganization(request);

    const newAsset: IPartialAsset = {
        assetId: name,
        name,
        description,
    };

    const response = await AssetApi.createAsset(newAsset, orgName);

    if (!response.success) {
        throw data('Record Not Found', { status: 404 });
    }

    return redirect(`/ressurser/${response.data?.name}`);
}
