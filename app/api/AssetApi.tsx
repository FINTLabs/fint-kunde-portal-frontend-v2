import { API_URL } from './constants';
import { IAsset, IPartialAsset } from '~/types/Asset';
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

    static async addAdapterToAsset(
        adapterName: string,
        assetName: string,
        organisationName: string
    ) {
        const functionName = 'addAdapterToAsset';
        const URL = `${API_URL}/api/assets/${organisationName}/${assetName}/adapters/${adapterName}`;
        return await request(URL, functionName, 'PUT', 'json', { name: adapterName });
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
