import { redirect } from 'react-router';

import AssetApi from '~/api/AssetApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

export async function handleAssetAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const assetName = formData.get('assetName') as string;
    const assetId = formData.get('assetId') as string;
    const orgName = await getSelectedOrganization(request);
    let deleteResponse = null;

    switch (actionType) {
        case 'CREATE':
            return await AssetApi.createAsset(
                {
                    name: assetId,
                    description: formData.get('assetDescription') as string,
                },
                orgName
            );

        case 'UPDATE':
            return await AssetApi.updateAsset(
                {
                    name: assetId,
                    assetId: formData.get('assetId') as string,
                    description: formData.get('assetDescription') as string,
                },
                orgName
            );

        case 'DELETE':
            deleteResponse = await AssetApi.deleteAsset(assetName, orgName);
            if (deleteResponse.success) {
                return redirect(`/ressurser?deleted=${assetName}`);
            }
            return deleteResponse;

        case 'UPDATE_ADAPTER':
            return await AssetApi.updateAdapterInAsset(
                formData.get('adapterName') as string,
                formData.get('assetName') as string,
                orgName,
                formData.get('updateType') as string
            );

        case 'UPDATE_CLIENT':
            return await AssetApi.updateClientInAsset(
                formData.get('clientName') as string,
                formData.get('assetName') as string,
                orgName,
                formData.get('updateType') as string
            );

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
