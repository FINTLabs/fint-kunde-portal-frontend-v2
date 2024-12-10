import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';
import { IPartialAdapter } from '~/types/Adapter';

const API_URL = process.env.API_URL;

class AdapterAPI {
    static async getAdapters(organisationName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'GET',
            url: `${API_URL}/api/adapters/${organisationName}`,
            functionName: 'getAdapters',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke hente adaptere for organisasjonen: ${organisationName}`
        );
    }

    static async createAdapter(
        adapter: IPartialAdapter,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'POST',
            url: `${API_URL}/api/adapters/${organisationName}`,
            functionName: 'createAdapter',
            body: JSON.stringify(adapter),
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke opprette adapteren',
            'Adapteren ble opprettet vellykket'
        );
    }

    static async updateAdapter(
        adapter: IPartialAdapter,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url: `${API_URL}/api/adapters/${organisationName}/${adapter.name}`,
            functionName: 'updateAdapter',
            body: JSON.stringify(adapter),
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere adapteren',
            'Adapteren ble oppdatert vellykket'
        );
    }

    static async updateComponentInAdapter(
        componentName: string,
        adapterName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<any>> {
        const url = `${API_URL}/api/components/organisation/${organisationName}/${componentName}/adapters/${adapterName}`;
        if (updateType === 'true') {
            return await this.addComponentToAdapter(url, adapterName);
        } else {
            return await this.removeComponentFromAdapter(url, adapterName);
        }
    }

    static async addComponentToAdapter(
        url: string,
        adapterName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url,
            functionName: 'addComponentToAdapter',
            body: JSON.stringify({ name: adapterName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke legge til komponenten i adapteren: ${adapterName}`,
            'Komponenten ble lagt til'
        );
    }

    static async removeComponentFromAdapter(
        url: string,
        adapterName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url,
            functionName: 'removeComponentFromAdapter',
            body: JSON.stringify({ name: adapterName }),
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke fjerne komponenten fra adapteren: ${adapterName}`,
            'Komponenten ble fjernet',
            'warning'
        );
    }

    static async deleteAdapter(name: string, organisationName: string): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'DELETE',
            url: `${API_URL}/api/adapters/${organisationName}/${name}`,
            functionName: 'deleteAdapter',
        });

        return handleApiResponse(
            apiResults,
            `Kunne ikke slette adapteren: ${name}`,
            'Adapteren ble slettet vellykket'
        );
    }

    static async getOpenIdSecret(
        adapterName: string,
        organisationName: string
    ): Promise<ApiResponse<string>> {
        const apiResults = await apiManager<string>({
            method: 'GET',
            url: `${API_URL}/api/adapters/${organisationName}/${adapterName}/secret`,
            functionName: 'getOpenIdSecret',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke hente OpenID Secret',
            'OpenID secret hente'
        );
    }

    static async setPassword(
        adapterName: string,
        password: string,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        const apiResults = await apiManager<any>({
            method: 'PUT',
            url: `${API_URL}/api/adapters/${organisationName}/${adapterName}/password`,
            functionName: 'setPassword',
            body: password,
            contentType: 'text/plain',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke sette passordet',
            'Passordet ble satt vellykket'
        );
    }
}

export default AdapterAPI;
