import { NovariApiManager, ApiResponse } from 'novari-frontend-components';
import { IPartialAdapter } from '~/types/Adapter';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const adapterManager = new NovariApiManager({
    baseUrl: API_URL,
});

class AdapterApi {
    static async getAdapters(organisationName: string): Promise<ApiResponse<any>> {
        return await adapterManager.call<any>({
            method: 'GET',
            endpoint: `/api/adapters/${organisationName}`,
            functionName: 'getAdapters',
            customErrorMessage: `Kunne ikke hente adaptere for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Adaptere hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async createAdapter(
        adapter: IPartialAdapter,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        return await adapterManager.call<any>({
            method: 'POST',
            endpoint: `/api/adapters/${organisationName}`,
            functionName: 'createAdapter',
            body: JSON.stringify(adapter),
            customErrorMessage: 'Kunne ikke opprette adapteren',
            customSuccessMessage: 'Adapteren ble opprettet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateAdapter(
        adapter: IPartialAdapter,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        return await adapterManager.call<any>({
            method: 'PUT',
            endpoint: `/api/adapters/${organisationName}/${adapter.name}`,
            functionName: 'updateAdapter',
            body: JSON.stringify(adapter),
            customErrorMessage: 'Kunne ikke oppdatere adapteren',
            customSuccessMessage: 'Adapteren ble oppdatert vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async updateComponentInAdapter(
        componentName: string,
        adapterName: string,
        organisationName: string,
        updateType: string
    ): Promise<ApiResponse<any>> {
        const endpoint = `/api/components/organisation/${organisationName}/${componentName}/adapters/${adapterName}`;
        if (updateType === 'true') {
            return this.addComponentToAdapter(endpoint, adapterName);
        } else {
            return this.removeComponentFromAdapter(endpoint, adapterName);
        }
    }

    private static async addComponentToAdapter(
        endpoint: string,
        adapterName: string
    ): Promise<ApiResponse<any>> {
        return await adapterManager.call<any>({
            method: 'PUT',
            endpoint,
            functionName: 'addComponentToAdapter',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke legge til komponenten i adapteren: ${adapterName}`,
            customSuccessMessage: 'Komponenten ble lagt til',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    private static async removeComponentFromAdapter(
        endpoint: string,
        adapterName: string
    ): Promise<ApiResponse<any>> {
        return await adapterManager.call<any>({
            method: 'DELETE',
            endpoint,
            functionName: 'removeComponentFromAdapter',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke fjerne komponenten fra adapteren: ${adapterName}`,
            customSuccessMessage: 'Komponenten ble fjernet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
            // customSuccessVariant: 'warning', // only if your manager supports variants
        });
    }

    static async deleteAdapter(name: string, organisationName: string): Promise<ApiResponse<any>> {
        return await adapterManager.call<any>({
            method: 'DELETE',
            endpoint: `/api/adapters/${organisationName}/${name}`,
            functionName: 'deleteAdapter',
            customErrorMessage: `Kunne ikke slette adapteren: ${name}`,
            customSuccessMessage: 'Adapteren ble slettet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getOpenIdSecret(
        adapterName: string,
        organisationName: string
    ): Promise<ApiResponse<string>> {
        return await adapterManager.call<string>({
            method: 'GET',
            endpoint: `/api/adapters/${organisationName}/${adapterName}/secret`,
            functionName: 'getOpenIdSecret',
            customErrorMessage: 'Kunne ikke hente OpenID Secret',
            customSuccessMessage: 'OpenID Secret hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async setPassword(
        adapterName: string,
        password: string,
        organisationName: string
    ): Promise<ApiResponse<any>> {
        return await adapterManager.call<any>({
            method: 'PUT',
            endpoint: `/api/adapters/${organisationName}/${adapterName}/password`,
            functionName: 'setPassword',
            body: password,
            contentType: 'text/plain',
            customErrorMessage: 'Kunne ikke sette passordet',
            customSuccessMessage: 'Passordet ble satt vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default AdapterApi;
