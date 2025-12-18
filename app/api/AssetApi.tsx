import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import { IAsset, IPartialAsset } from '~/types/Asset';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const assetManager = new NovariApiManager({
    baseUrl: API_URL,
});

class AssetApi {
    static async getPrimaryAsset(organisationName: string): Promise<ApiResponse<IAsset>> {
        return await assetManager.call<IAsset>({
            method: 'GET',
            endpoint: `/api/assets/${organisationName}/primary`,
            functionName: 'getPrimaryAsset',
            customErrorMessage: `Kunne ikke hente primærressurs for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Primærressurs hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getAllAssets(organisationName: string): Promise<ApiResponse<IAsset[]>> {
        return await assetManager.call<IAsset[]>({
            method: 'GET',
            endpoint: `/api/assets/${organisationName}/`,
            functionName: 'getAllAssets',
            customErrorMessage: `Kunne ikke hente assets for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Assets hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async createAsset(
        asset: IPartialAsset,
        organisationName: string
    ): Promise<ApiResponse<IAsset>> {
        return await assetManager.call<IAsset>({
            method: 'POST',
            endpoint: `/api/assets/${organisationName}/`,
            functionName: 'createAsset',
            body: JSON.stringify(asset),
            customErrorMessage: 'Kunne ikke opprette asset',
            customSuccessMessage: 'Asset ble opprettet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateAsset(
        asset: IPartialAsset,
        organisationName: string
    ): Promise<ApiResponse<IAsset>> {
        return await assetManager.call<IAsset>({
            method: 'PUT',
            endpoint: `/api/assets/${organisationName}/${asset.name}`,
            functionName: 'updateAsset',
            body: JSON.stringify(asset),
            customErrorMessage: 'Kunne ikke oppdatere asset',
            customSuccessMessage: 'Asset ble oppdatert vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async deleteAsset(name: string, organisationName: string): Promise<ApiResponse<void>> {
        return await assetManager.call<void>({
            method: 'DELETE',
            endpoint: `/api/assets/${organisationName}/${name}`,
            functionName: 'deleteAsset',
            customErrorMessage: `Kunne ikke slette asset: ${name}`,
            customSuccessMessage: 'Asset ble slettet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getAssetById(orgName: string, assetId: string): Promise<ApiResponse<IAsset>> {
        return await assetManager.call<IAsset>({
            method: 'GET',
            endpoint: `/api/assets/${orgName}/${assetId}`,
            functionName: 'getAssetById',
            customErrorMessage: `Kunne ikke hente asset med ID: ${assetId}`,
            customSuccessMessage: `Asset med ID ${assetId} ble hentet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateAdapterInAsset(
        adapterName: string,
        assetName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<void>> {
        const endpoint = `/api/assets/${organisationName}/${assetName}/adapters/${adapterName}`;
        return updateType === 'add'
            ? this.addAdapterToAsset(endpoint, adapterName)
            : this.removeAdapterFromAsset(endpoint, adapterName);
    }

    private static async addAdapterToAsset(
        endpoint: string,
        adapterName: string
    ): Promise<ApiResponse<void>> {
        return await assetManager.call<void>({
            method: 'PUT',
            endpoint,
            functionName: 'addAdapterToAsset',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke legge til adapteren: ${adapterName}`,
            customSuccessMessage: `Adapteren ${adapterName} ble lagt til.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    private static async removeAdapterFromAsset(
        endpoint: string,
        adapterName: string
    ): Promise<ApiResponse<void>> {
        return await assetManager.call<void>({
            method: 'DELETE',
            endpoint,
            functionName: 'removeAdapterFromAsset',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke fjerne adapteren: ${adapterName}`,
            customSuccessMessage: `Adapteren ${adapterName} ble fjernet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateClientInAsset(
        clientName: string,
        assetName: string,
        organisationName: string,
        updateType: string,
        primaryAssetName: string
    ): Promise<ApiResponse<void>> {
        const baseEndpoint = `/api/assets/${organisationName}`;

        if (updateType === 'add') {
            return await assetManager.call<void>({
                method: 'PUT',
                endpoint: `${baseEndpoint}/${assetName}/clients/${clientName}`,
                functionName: 'addClientToAsset',
                body: JSON.stringify({ name: clientName }),
                customErrorMessage: `Kunne ikke legge til klienten: ${clientName}`,
                customSuccessMessage: `Klienten ${clientName} ble lagt til.`,
                additionalHeaders: {
                    'x-nin': HeaderProperties.getXnin(),
                },
            });
        }

        const removeResponse = await assetManager.call<void>({
            method: 'DELETE',
            endpoint: `${baseEndpoint}/${assetName}/clients/${clientName}`,
            functionName: 'removeClientFromAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke fjerne klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble fjernet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });

        if (!removeResponse.success) {
            return removeResponse;
        }

        const addPrimaryResponse = await assetManager.call<void>({
            method: 'PUT',
            endpoint: `${baseEndpoint}/${primaryAssetName}/clients/${clientName}`,
            functionName: 'addClientToPrimaryAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke sette klient '${clientName}' som primærressurs '${primaryAssetName}'.`,
            customSuccessMessage: `Fjernet klient '${clientName}' og satt til klient primærressurs '${primaryAssetName}'.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });

        if (addPrimaryResponse.success) {
            return addPrimaryResponse;
        }

        return {
            success: false,
            message: `Klient '${clientName}' ble fjernet, men kunne ikke settes som primærressurs '${primaryAssetName}'.`,
            variant: 'error',
        };
    }

    static async addClientToAsset(url: string, clientName: string): Promise<ApiResponse<void>> {
        return await assetManager.call<void>({
            method: 'PUT',
            endpoint: url.replace(API_URL || '', ''), // convert to relative if old callers pass full URL
            functionName: 'addClientToAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke legge til klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble lagt til.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async removeClientFromAsset(
        url: string,
        clientName: string
    ): Promise<ApiResponse<void>> {
        return await assetManager.call<void>({
            method: 'DELETE',
            endpoint: url.replace(API_URL || '', ''), // convert to relative
            functionName: 'removeClientFromAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke fjerne klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble fjernet.`,
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default AssetApi;
