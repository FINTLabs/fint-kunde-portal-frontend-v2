import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderProperties } from '~/utils/headerProperties';

const { mockCall } = vi.hoisted(() => {
    return {
        mockCall: vi.fn(),
    };
});

vi.mock('novari-frontend-components', () => {
    class MockNovariApiManager {
        call = mockCall;
    }

    return {
        NovariApiManager: MockNovariApiManager,
    };
});

vi.mock('~/utils/headerProperties', () => ({
    HeaderProperties: {
        getXnin: vi.fn(),
    },
}));

import AssetApi from './AssetApi';

describe('AssetApi', () => {
    const organisationName = 'fint-org';
    const assetName = 'asset-a';
    const assetId = 'asset-id-1';
    const adapterName = 'adapter-a';
    const clientName = 'client-a';
    const partialAsset = {
        name: assetName,
        description: 'Test asset description',
    };

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('getPrimaryAsset calls expected endpoint', async () => {
        await AssetApi.getPrimaryAsset(organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/assets/${organisationName}/primary`,
            functionName: 'getPrimaryAsset',
            customErrorMessage: `Kunne ikke hente primærressurs for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Primærressurs hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getAllAssets calls expected endpoint', async () => {
        await AssetApi.getAllAssets(organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/assets/${organisationName}/`,
            functionName: 'getAllAssets',
            customErrorMessage: `Kunne ikke hente assets for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Assets hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('createAsset posts asset payload', async () => {
        await AssetApi.createAsset(partialAsset, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/api/assets/${organisationName}/`,
            functionName: 'createAsset',
            body: JSON.stringify(partialAsset),
            customErrorMessage: 'Kunne ikke opprette asset',
            customSuccessMessage: 'Asset ble opprettet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateAsset puts asset payload by name', async () => {
        await AssetApi.updateAsset(partialAsset, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/assets/${organisationName}/${assetName}`,
            functionName: 'updateAsset',
            body: JSON.stringify(partialAsset),
            customErrorMessage: 'Kunne ikke oppdatere asset',
            customSuccessMessage: 'Asset ble oppdatert vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('deleteAsset deletes by name', async () => {
        await AssetApi.deleteAsset(assetName, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/assets/${organisationName}/${assetName}`,
            functionName: 'deleteAsset',
            customErrorMessage: `Kunne ikke slette asset: ${assetName}`,
            customSuccessMessage: 'Asset ble slettet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getAssetById fetches asset by ID', async () => {
        await AssetApi.getAssetById(organisationName, assetId);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/assets/${organisationName}/${assetId}`,
            functionName: 'getAssetById',
            customErrorMessage: `Kunne ikke hente asset med ID: ${assetId}`,
            customSuccessMessage: `Asset med ID ${assetId} ble hentet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateAdapterInAsset adds adapter when updateType is add', async () => {
        await AssetApi.updateAdapterInAsset(adapterName, assetName, organisationName, 'add');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/assets/${organisationName}/${assetName}/adapters/${adapterName}`,
            functionName: 'addAdapterToAsset',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke legge til adapteren: ${adapterName}`,
            customSuccessMessage: `Adapteren ${adapterName} ble lagt til.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateAdapterInAsset removes adapter when updateType is not add', async () => {
        await AssetApi.updateAdapterInAsset(adapterName, assetName, organisationName, 'remove');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/assets/${organisationName}/${assetName}/adapters/${adapterName}`,
            functionName: 'removeAdapterFromAsset',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke fjerne adapteren: ${adapterName}`,
            customSuccessMessage: `Adapteren ${adapterName} ble fjernet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateClientInAsset adds client when updateType is add', async () => {
        await AssetApi.updateClientInAsset(clientName, assetName, organisationName, 'add');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/assets/${organisationName}/${assetName}/clients/${clientName}`,
            functionName: 'addClientToAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke legge til klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble lagt til.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateClientInAsset removes client when updateType is not add', async () => {
        await AssetApi.updateClientInAsset(clientName, assetName, organisationName, 'remove');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/assets/${organisationName}/${assetName}/clients/${clientName}`,
            functionName: 'removeClientFromAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke fjerne klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble fjernet.`,
            customSuccessVariant: 'warning',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('addClientToAsset uses provided URL endpoint', async () => {
        const url = '/api/assets/fint-org/asset-a/clients/client-a';
        await AssetApi.addClientToAsset(url, clientName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: url,
            functionName: 'addClientToAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke legge til klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble lagt til.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('removeClientFromAsset uses provided URL endpoint', async () => {
        const url = '/api/assets/fint-org/asset-a/clients/client-a';
        await AssetApi.removeClientFromAsset(url, clientName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: url,
            functionName: 'removeClientFromAsset',
            body: JSON.stringify({ name: clientName }),
            customErrorMessage: `Kunne ikke fjerne klienten: ${clientName}`,
            customSuccessMessage: `Klienten ${clientName} ble fjernet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
