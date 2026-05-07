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

import ClientApi from './ClientApi';

describe('ClientApi', () => {
    const organisationName = 'fint-org';
    const clientName = 'client-a';
    const componentName = 'component-a';

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('getClients calls expected endpoint with headers', async () => {
        await ClientApi.getClients(organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/clients/${organisationName}`,
            functionName: 'getClients',
            customErrorMessage: `Kunne ikke hente klienter for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Klienter hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getClientModelVersions calls expected endpoint with headers', async () => {
        await ClientApi.getClientModelVersions(organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/client-metrics/${organisationName}/model-versions`,
            functionName: 'getClientModelVersions',
            customErrorMessage: `Kunne ikke hente modellversjoner for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Modellversjoner hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getClientById returns matching client when found', async () => {
        const matchingClient = { name: clientName };
        const getClientsSpy = vi
            .spyOn(ClientApi, 'getClients')
            .mockResolvedValue({ success: true, data: [{ name: 'other' }, matchingClient] } as any);

        const result = await ClientApi.getClientById(organisationName, clientName);

        expect(getClientsSpy).toHaveBeenCalledWith(organisationName);
        expect(result).toEqual(matchingClient);

        getClientsSpy.mockRestore();
    });

    it('getClientById returns null when no matching client exists', async () => {
        const getClientsSpy = vi
            .spyOn(ClientApi, 'getClients')
            .mockResolvedValue({ success: true, data: [{ name: 'other' }] } as any);

        const result = await ClientApi.getClientById(organisationName, clientName);

        expect(getClientsSpy).toHaveBeenCalledWith(organisationName);
        expect(result).toBeNull();

        getClientsSpy.mockRestore();
    });

    it('createClient posts payload to expected endpoint', async () => {
        const partialClient = {
            name: clientName,
            shortDescription: 'Kort beskrivelse',
            note: 'Notat',
            modelVersion: 'V4',
        };

        await ClientApi.createClient(partialClient, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/api/clients/${organisationName}`,
            functionName: 'createClient',
            body: JSON.stringify(partialClient),
            customErrorMessage: 'Kunne ikke opprette klienten',
            customSuccessMessage: 'Klienten ble opprettet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateClient puts payload to expected endpoint', async () => {
        await ClientApi.updateClient(
            clientName,
            'Oppdatert beskrivelse',
            'Oppdatert notat',
            'V4',
            organisationName
        );

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/clients/${organisationName}/${clientName}`,
            functionName: 'updateClient',
            body: JSON.stringify({
                name: clientName,
                shortDescription: 'Oppdatert beskrivelse',
                note: 'Oppdatert notat',
                modelVersion: 'V4',
            }),
            customErrorMessage: 'Kunne ikke oppdatere klienten',
            customSuccessMessage: 'Klienten ble oppdatert vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('deleteClient calls expected delete endpoint', async () => {
        await ClientApi.deleteClient(clientName, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/clients/${organisationName}/${clientName}`,
            functionName: 'deleteClient',
            customErrorMessage: 'Kunne ikke slette klienten',
            customSuccessMessage: 'Klienten ble slettet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getOpenIdSecret calls expected secret endpoint', async () => {
        await ClientApi.getOpenIdSecret(clientName, organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/clients/${organisationName}/${clientName}/secret`,
            functionName: 'getOpenIdSecret',
            customErrorMessage: 'Kunne ikke hente OpenID Secret',
            customSuccessMessage: 'Klienthemmeligheten ble hentet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateComponentInClient adds component when updateType is true', async () => {
        await ClientApi.updateComponentInClient(
            componentName,
            clientName,
            organisationName,
            'true'
        );

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/components/organisation/${organisationName}/${componentName}/clients/${clientName}`,
            functionName: 'addComponentToClient',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke legge til komponenten: ${componentName}`,
            customSuccessMessage: 'Komponenten ble lagt til',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateComponentInClient removes component when updateType is not true', async () => {
        await ClientApi.updateComponentInClient(
            componentName,
            clientName,
            organisationName,
            'false'
        );

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/components/organisation/${organisationName}/${componentName}/clients/${clientName}`,
            functionName: 'removeComponentFromClient',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke fjerne komponenten: ${componentName}`,
            customSuccessMessage: 'Komponenten ble fjernet',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('setPassword sends plain text body', async () => {
        await ClientApi.setPassword(clientName, 'super-secret', organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/clients/${organisationName}/${clientName}/password`,
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
