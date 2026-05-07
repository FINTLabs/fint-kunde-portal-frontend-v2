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

import AdapterApi from './AdapterApi';

describe('AdapterApi', () => {
    const organisationName = 'fint-org';
    const adapterName = 'adapter-a';
    const componentName = 'component-a';
    const partialAdapter = {
        name: adapterName,
        shortDescription: 'Kort beskrivelse',
        note: 'Testnotat',
    };

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('getAdapters calls expected endpoint with headers', async () => {
        await AdapterApi.getAdapters(organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/adapters/${organisationName}`,
            functionName: 'getAdapters',
            customErrorMessage: `Kunne ikke hente adaptere for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Adaptere hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('createAdapter posts adapter payload', async () => {
        await AdapterApi.createAdapter(partialAdapter, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/api/adapters/${organisationName}`,
            functionName: 'createAdapter',
            body: JSON.stringify(partialAdapter),
            customErrorMessage: 'Kunne ikke opprette adapteren',
            customSuccessMessage: 'Adapteren ble opprettet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateAdapter puts adapter payload by adapter name', async () => {
        await AdapterApi.updateAdapter(partialAdapter, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/adapters/${organisationName}/${adapterName}`,
            functionName: 'updateAdapter',
            body: JSON.stringify(partialAdapter),
            customErrorMessage: 'Kunne ikke oppdatere adapteren',
            customSuccessMessage: 'Adapteren ble oppdatert vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateComponentInAdapter adds component when updateType is true', async () => {
        await AdapterApi.updateComponentInAdapter(
            componentName,
            adapterName,
            organisationName,
            'true'
        );

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/components/organisation/${organisationName}/${componentName}/adapters/${adapterName}`,
            functionName: 'addComponentToAdapter',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke legge til komponenten i adapteren: ${adapterName}`,
            customSuccessMessage: 'Komponenten ble lagt til',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateComponentInAdapter removes component when updateType is false', async () => {
        await AdapterApi.updateComponentInAdapter(
            componentName,
            adapterName,
            organisationName,
            'false'
        );

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/components/organisation/${organisationName}/${componentName}/adapters/${adapterName}`,
            functionName: 'removeComponentFromAdapter',
            body: JSON.stringify({ name: adapterName }),
            customErrorMessage: `Kunne ikke fjerne komponenten fra adapteren: ${adapterName}`,
            customSuccessMessage: 'Komponenten ble fjernet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('deleteAdapter deletes adapter by name', async () => {
        await AdapterApi.deleteAdapter(adapterName, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/adapters/${organisationName}/${adapterName}`,
            functionName: 'deleteAdapter',
            customErrorMessage: `Kunne ikke slette adapteren: ${adapterName}`,
            customSuccessMessage: 'Adapteren ble slettet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getOpenIdSecret calls secret endpoint', async () => {
        await AdapterApi.getOpenIdSecret(adapterName, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/adapters/${organisationName}/${adapterName}/secret`,
            functionName: 'getOpenIdSecret',
            customErrorMessage: 'Kunne ikke hente OpenID Secret',
            customSuccessMessage: 'OpenID Secret hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('setPassword sends plain text payload', async () => {
        await AdapterApi.setPassword(adapterName, 'super-secret', organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/adapters/${organisationName}/${adapterName}/password`,
            functionName: 'setPassword',
            body: 'super-secret',
            contentType: 'text/plain',
            customErrorMessage: 'Kunne ikke sette passordet',
            customSuccessMessage: 'Passordet ble satt vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
