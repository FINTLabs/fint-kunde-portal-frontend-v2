import { API_URL } from './constants';
import { IPartialAsset } from '~/types/Asset';
import { request } from '~/api/shared/api';

class AssetApi {
    static async getAllAssets(organisation: string) {
        const functionName = 'getAllAssets';
        const URL = `${API_URL}/api/assets/${organisation}/`;
        return request(URL, functionName);
    }

    static async updateAccess(access: IPartialAsset, organisationName: string) {
        const functionName = 'updateAccess';
        const URL = `${API_URL}/api/assets/${organisationName}/${access.name}`;
        return await request(URL, functionName, 'PUT', 'json', access);
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

    // static async setAccess(access, organisation) {
    //     const url = `${API_URL}/api/accesses/${organisation}/`;
    //     log('Setting access information', url);
    //
    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             credentials: 'same-origin',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'x-nin': process.env.PERSONALNUMBER || '',
    //             },
    //             body: JSON.stringify(access),
    //         });
    //
    //         if (response.ok) {
    //             return await response.json();
    //         } else {
    //             error('Error setting access information', response.status);
    //             return 'try-error';
    //         }
    //     } catch (err) {
    //         log(err);
    //         error('Error setting access information:', err);
    //         throw new Error('Error setting access information');
    //     }
    // }
    //

    // static async updateAccess(access, organisation) {
    //     const url = `${API_URL}/api/accesses/${organisation}/${access.name}`;
    //     log('Updating access information', url);

    //     try {
    //         const response = await fetch(url, {
    //             method: 'PUT',
    //             credentials: 'same-origin',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'x-nin': process.env.PERSONALNUMBER || '',
    //             },
    //             body: JSON.stringify(access),
    //         });

    //         if (response.ok) {
    //             return await response.json();
    //         } else {
    //             error('Error updating access information', response.status);
    //             return 'try-error';
    //         }
    //     } catch (err) {
    //         log(err);
    //         error('Error updating access information:', err);
    //         throw new Error('Error updating access information');
    //     }
    // }
    //
    // static async deleteAccess(access, organisation) {
    //     const url = `${API_URL}/api/accesses/${organisation}/${access.name}`;
    //     log('Deleting access information', url);
    //
    //     try {
    //         const response = await fetch(url, {
    //             method: 'DELETE',
    //             credentials: 'same-origin',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'x-nin': process.env.PERSONALNUMBER || '',
    //             },
    //         });
    //
    //         if (response.ok) {
    //             return await response.json();
    //         } else {
    //             error('Error deleting access information', response.status);
    //             return 'try-error';
    //         }
    //     } catch (err) {
    //         log(err);
    //         error('Error deleting access information:', err);
    //         throw new Error('Error deleting access information');
    //     }
    // }
}

export default AssetApi;
