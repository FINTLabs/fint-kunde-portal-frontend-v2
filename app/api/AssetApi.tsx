import { API_URL } from './constants';
import { IPartialAsset } from '~/types/Asset';
import { request } from '~/api/shared/api';

class AssetApi {
    static async getAllAssets(organisationName: string) {
        const functionName = 'getAllAssets';
        const URL = `${API_URL}/api/assets/${organisationName}/`;
        return request(URL, functionName);
    }

    static async createAsset(asset: IPartialAsset, organisationName: string) {
        const functionName = 'createAsset';
        const URL = `${API_URL}/api/assets/${organisationName}/`;
        return await request(URL, functionName, 'POST', 'json', asset);
    }

    static async updateAsset(asset: IPartialAsset, organisationName: string) {
        const functionName = 'updateAsset';
        const URL = `${API_URL}/api/assets/${organisationName}/${asset.name}`;
        return await request(URL, functionName, 'PUT', 'json', asset);
    }

    static async deleteAsset(name: string, organisationName: string) {
        const functionName = 'deleteAsset';
        const URL = `${API_URL}/api/assets/${organisationName}/${name}`;
        return await request(URL, functionName, 'DELETE');
    }

    static async getAssetById(orgName: string, assetId: string) {
        const functionName = 'getAssetById';
        const URL = `${API_URL}/api/assets/${orgName}/${assetId}`;
        return request(URL, functionName);
    }

    static async updateAdapterInAsset(
        adapterName: string,
        assetName: string,
        organisationName: string,
        updateType: string
    ) {
        const URL = `${API_URL}/api/assets/${organisationName}/${assetName}/adapters/${adapterName}`;
        if (updateType === 'add') {
            return await AssetApi.addAdapterToAsset(URL, adapterName);
        } else {
            return await AssetApi.removeAdapterFromAsset(URL, adapterName);
        }
    }

    static async addAdapterToAsset(URL: string, adapterName: string) {
        const functionName = 'addAdapterToAsset';
        return await request(URL, functionName, 'PUT', 'json', { name: adapterName });
    }

    static async removeAdapterFromAsset(URL: string, adapterName: string) {
        const functionName = 'removeAdapterFromAsset';
        return await request(URL, functionName, 'DELETE', 'json', { name: adapterName });
    }

    static async updateClientInAsset(
        clientName: string,
        assetName: string,
        organisationName: string,
        updateType: string
    ) {
        const URL = `${API_URL}/api/assets/${organisationName}/${assetName}/clients/${clientName}`;
        if (updateType === 'add') {
            return await AssetApi.addClientToAsset(URL, clientName);
        } else {
            return await AssetApi.removeClientFromAsset(URL, clientName);
        }
    }

    static async addClientToAsset(URL: string, clientName: string) {
        const functionName = 'addClientToAsset';
        return await request(URL, functionName, 'PUT', 'json', { name: clientName });
    }

    static async removeClientFromAsset(URL: string, clientName: string) {
        const functionName = 'removeClientFromAsset';
        return await request(URL, functionName, 'DELETE', 'json', { name: clientName });
    }
}

export default AssetApi;
