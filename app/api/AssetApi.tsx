import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';
import { IPartialAsset } from '~/types/Asset';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const assetManager = new NovariApiManager({
    baseUrl: API_URL,
    defaultHeaders: {
        'x-nin': HeaderProperties.getXnin(),
    },
});

class AssetApi {
    static async getAllAssets(organisationName: string): Promise<ApiResponse<any>> {
        return await assetManager.call<any>({
            method: 'GET',
            endpoint: `/api/assets/${organisationName}/`,
            functionName: 'getAllAssets',
            customErrorMessage: `Kunne ikke hente eiendeler for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Eiendeler hentet',
        });
    }

    static async createAsset(
        asset: IPartialAsset,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        return await assetManager.call<any>({
            method: 'POST',
            endpoint: `/api/assets/${organisationName}/`,
            functionName: 'createAsset',
            body: JSON.stringify(asset),
            customErrorMessage: 'Kunne ikke opprette eiendelen',
            customSuccessMessage: 'Eiendelen ble opprettet vellykket',
        });
    }

    static async updateAsset(
        asset: IPartialAsset,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        return await assetManager.call<any>({
            method: 'PUT',
            endpoint: `/api/assets/${organisationName}/${asset.name}`,
            functionName: 'updateAsset',
            body: JSON.stringify(asset),
            customErrorMessage: 'Kunne ikke oppdatere eiendelen',
            customSuccessMessage: 'Eiendelen ble oppdatert vellykket',
        });
    }

    static async deleteAsset(name: string, organisationName: string): Promise<ApiResponse<any>> {
        return await assetManager.call<any>({
            method: 'DELETE',
            endpoint: `/api/assets/${organisationName}/${name}`,
            functionName: 'deleteAsset',
            customErrorMessage: `Kunne ikke slette eiendelen: ${name}`,
            customSuccessMessage: 'Eiendelen ble slettet vellykket',
        });
    }

    static async getAssetById(orgName: string, assetId: string): Promise<ApiResponse<any>> {
        return await assetManager.call<any>({
            method: 'GET',
            endpoint: `/api/assets/${orgName}/${assetId}`,
            functionName: 'getAssetById',
            customErrorMessage: `Kunne ikke hente eiendelen med ID: ${assetId}`,
            customSuccessMessage: `Eiendelen med ID ${assetId} ble hentet.`,
        });
    }

    static async updateAdapterInAsset(
        adapterName: string,
        assetName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<any>> {
        const endpoint = `/api/assets/${organisationName}/${assetName}/adapters/${adapterName}`;
        return updateType === 'add'
            ? this.addAdapterToAsset(endpoint, adapterName)
            : this.removeAdapterFromAsset(endpoint, adapterName);
    }

    private static async addAdapterToAsset(
        endpoint: string,
        adapterName: string
    ): Promise<ApiResponse<any>> {
        return await assetManager.call<any>({
            method: 'PUT',
            endpoint,
            functionName: 'addAdapterToAsset',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke legge til adapteren: ${adapterName}`,
            customSuccessMessage: `Adapteren ${adapterName} ble lagt til.`,
        });
    }

    private static async removeAdapterFromAsset(
        endpoint: string,
        adapterName: string
    ): Promise<ApiResponse<any>> {
        return await assetManager.call<any>({
            method: 'DELETE',
            endpoint,
            functionName: 'removeAdapterFromAsset',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke fjerne adapteren: ${adapterName}`,
            customSuccessMessage: `Adapteren ${adapterName} ble fjernet.`,
        });
    }

    static async updateClientInAsset(
        clientName: string,
        assetName: string,
        organisationName: string,
        updateType: string,
        primaryAssetName: string
    ): Promise<ApiResponse<any>> {
        const baseEndpoint = `/api/assets/${organisationName}`;

        if (updateType === 'add') {
            // add client to asset
            return await assetManager.call<any>({
                method: 'PUT',
                endpoint: `${baseEndpoint}/${assetName}/clients/${clientName}`,
                functionName: 'addClientToAsset',
                body: JSON.stringify({ name: clientName }),
                customErrorMessage: `Kunne ikke legge til klienten: ${clientName}`,
                customSuccessMessage: `Klienten ${clientName} ble lagt til.`,
            });
        }

        // remove then add to primary
        const removeResponse = await assetManager.call<any>({
            method: 'DELETE',
            endpoint: `${baseEndpoint}/${assetName}/clients/${clientName}`,
            functionName: 'removeClientFromAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke fjerne klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble fjernet.`,
        });

        if (!removeResponse.success) {
            return removeResponse;
        }

        const addPrimaryResponse = await assetManager.call<any>({
            method: 'PUT',
            endpoint: `${baseEndpoint}/${primaryAssetName}/clients/${clientName}`,
            functionName: 'addClientToPrimaryAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke sette klient '${clientName}' som primærressurs '${primaryAssetName}'.`,
            customSuccessMessage: `Fjernet klient '${clientName}' og satt til klient primærressurs '${primaryAssetName}'.`,
        });

        if (addPrimaryResponse.success) {
            return addPrimaryResponse;
        }

        // Compose a failure response mirroring your previous behavior
        return {
            success: false,
            message: `Klient '${clientName}' ble fjernet, men kunne ikke settes som primærressurs '${primaryAssetName}'.`,
            variant: 'error',
        };
    }

    static async addClientToAsset(url: string, clientName: string): Promise<ApiResponse<any>> {
        // Kept for backward compatibility if you still call it elsewhere.
        return await assetManager.call<any>({
            method: 'PUT',
            endpoint: url.replace(API_URL || '', ''), // convert to relative if old callers pass full URL
            functionName: 'addClientToAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke legge til klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble lagt til.`,
        });
    }

    static async removeClientFromAsset(url: string, clientName: string): Promise<ApiResponse<any>> {
        // Kept for backward compatibility if you still call it elsewhere.
        return await assetManager.call<any>({
            method: 'DELETE',
            endpoint: url.replace(API_URL || '', ''), // convert to relative
            functionName: 'removeClientFromAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke fjerne klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble fjernet.`,
        });
    }
}

export default AssetApi;
