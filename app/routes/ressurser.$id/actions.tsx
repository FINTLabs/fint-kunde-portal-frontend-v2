import { redirect } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import AssetApi from '~/api/AssetApi';

export async function handleAssetAction({ request, params }: { request: Request; params: any }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const orgName = await getSelectedOrganization(request);
    const name = params.id || '';

    switch (actionType) {
        case 'CREATE':
            return await AssetApi.createAsset(
                {
                    name,
                    description: formData.get('assetDescription') as string,
                },
                orgName
            );

        case 'UPDATE':
            return await AssetApi.updateAsset(
                {
                    name,
                    assetId: formData.get('assetId') as string,
                    description: formData.get('assetDescription') as string,
                },
                orgName
            );

        case 'DELETE':
            const assetName = formData.get('assetName') as string;
            const deleteResponse = await AssetApi.deleteAsset(assetName, orgName);
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
                formData.get('updateType') as string,
                formData.get('primaryAssetDN') as string
            );

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
