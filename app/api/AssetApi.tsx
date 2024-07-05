import { log, error } from '~/utils/logger';
import { API_URL } from './constants';
import { IAsset } from '~/types/Asset';

class AssetApi {
    static async getAllAssets(organisation: string) {
        const url = `${API_URL}/api/assets/${organisation}/`;
        log('Fetching access information', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nin': process.env.PERSONALNUMBER || '',
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                error('Error fetching access information', response.status);
                return 'try-error';
            }
        } catch (err) {
            log(err);
            error('Error fetching access information:', err);
            throw new Error('Error fetching access information');
        }
    }

    static async getAssetById(orgName: string, assetId: string) {
        try {
            const assets: IAsset[] = await this.getAllAssets(orgName);
            log('asset search', assetId);
            if (assets) {
                const asset = assets.find((item) => item.name === assetId);

                if (asset) {
                    return asset;
                } else {
                    error('Asset not found, assetId:', assetId);
                    return null;
                }
            } else {
                error('No assests found for organisation:', orgName);
                return null;
            }
        } catch (err) {
            error('Error fetching asset:', err);
            return null;
        }
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
    //
    //     try {
    //         const response = await fetch(url, {
    //             method: 'PUT',
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
