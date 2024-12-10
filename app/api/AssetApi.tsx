import { apiManager, handleApiResponse, ApiResponse } from '~/api/ApiManager';
import { IPartialAsset } from '~/types/Asset';
const API_URL = process.env.API_URL;

class AssetApi {
    static async getAllAssets(organisationName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/assets/${organisationName}/`,
            functionName: 'getAllAssets',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente eiendeler for organisasjonen: ${organisationName}`
        );
    }

    static async createAsset(
        asset: IPartialAsset,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/api/assets/${organisationName}/`,
            functionName: 'createAsset',
            body: JSON.stringify(asset),
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke opprette eiendelen',
            'Eiendelen ble opprettet vellykket'
        );
    }

    static async updateAsset(
        asset: IPartialAsset,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url: `${API_URL}/api/assets/${organisationName}/${asset.name}`,
            functionName: 'updateAsset',
            body: JSON.stringify(asset),
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere eiendelen',
            'Eiendelen ble oppdatert vellykket'
        );
    }

    static async deleteAsset(name: string, organisationName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url: `${API_URL}/api/assets/${organisationName}/${name}`,
            functionName: 'deleteAsset',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke slette eiendelen: ${name}`,
            'Eiendelen ble slettet vellykket'
        );
    }

    static async getAssetById(orgName: string, assetId: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/assets/${orgName}/${assetId}`,
            functionName: 'getAssetById',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente eiendelen med ID: ${assetId}`,
            `Eiendelen med ID ${assetId} ble hentet.`,
            'success'
        );
    }

    static async updateAdapterInAsset(
        adapterName: string,
        assetName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<any>> {
        const url = `${API_URL}/api/assets/${organisationName}/${assetName}/adapters/${adapterName}`;
        if (updateType === 'add') {
            return await this.addAdapterToAsset(url, adapterName);
        } else {
            return await this.removeAdapterFromAsset(url, adapterName);
        }
    }

    static async addAdapterToAsset(url: string, adapterName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url,
            functionName: 'addAdapterToAsset',
            body: JSON.stringify({ name: adapterName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke legge til adapteren: ${adapterName}`,
            `Adapteren ${adapterName} ble lagt til.`,
            'success'
        );
    }

    static async removeAdapterFromAsset(
        url: string,
        adapterName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url,
            functionName: 'removeAdapterFromAsset',
            body: JSON.stringify({ name: adapterName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke fjerne adapteren: ${adapterName}`,
            `Adapteren ${adapterName} ble fjernet.`,
            'success'
        );
    }

    static async updateClientInAsset(
        clientName: string,
        assetName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<any>> {
        const url = `${API_URL}/api/assets/${organisationName}/${assetName}/clients/${clientName}`;
        if (updateType === 'add') {
            return await this.addClientToAsset(url, clientName);
        } else {
            return await this.removeClientFromAsset(url, clientName);
        }
    }

    static async addClientToAsset(url: string, clientName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url,
            functionName: 'addClientToAsset',
            body: JSON.stringify({ name: clientName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke legge til klienten: ${clientName}`,
            `Klienten ${clientName} ble lagt til.`,
            'success'
        );
    }

    static async removeClientFromAsset(url: string, clientName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url,
            functionName: 'removeClientFromAsset',
            body: JSON.stringify({ name: clientName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke fjerne klienten: ${clientName}`,
            `Klienten ${clientName} ble fjernet.`,
            'success'
        );
    }
}

export default AssetApi;
