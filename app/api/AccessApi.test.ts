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
        getUsername: vi.fn(),
    },
}));

import AccessApi from './AccessApi';

describe('AccessApi', () => {
    const username = 'test-user';
    const clientOrAdapter = 'client-a';
    const componentName = 'component-a';
    const resourceName = 'resource-a';
    const fieldName = 'field-a';

    const headers = {
        'x-nin': '12345678901',
        'x-portalUser': 'jennifer',
    };

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        vi.mocked(HeaderProperties.getUsername).mockReturnValue('jennifer');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('getClientOrAdapterAccess calls access endpoint with headers', async () => {
        await AccessApi.getClientOrAdapterAccess(username);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/access/${username}`,
            functionName: 'getClientOrAdapterAccess',
            customErrorMessage: `Kunne ikke hente tilgang for: ${username}`,
            customSuccessMessage: `Tilgang for ${username} ble hentet`,
            additionalHeaders: headers,
        });
    });

    it('getClientOrAdapterAccessComponents calls component endpoint with headers', async () => {
        await AccessApi.getClientOrAdapterAccessComponents(username);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/access/${username}/component`,
            functionName: 'getClientorAdapterAccessComponents',
            customErrorMessage: `Kunne ikke hente tilgang for: ${username}`,
            customSuccessMessage: `Tilgang for ${username} ble hentet.`,
            additionalHeaders: headers,
        });
    });

    it('getComponentAccess calls component resource endpoint with headers', async () => {
        await AccessApi.getComponentAccess(componentName, clientOrAdapter);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/access/${clientOrAdapter}/component/${componentName}/resource`,
            functionName: 'getComponentAccess',
            customErrorMessage: `Kunne ikke hente komponenttilgang for: ${componentName}`,
            customSuccessMessage: `Komponenttilgang for ${componentName} ble hentet.`,
            additionalHeaders: headers,
        });
    });

    it('getResourceAccess calls resource endpoint with headers', async () => {
        await AccessApi.getResourceAccess(clientOrAdapter, componentName, resourceName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/access/${clientOrAdapter}/component/${componentName}/resource/${resourceName}`,
            functionName: 'getResourceAccess',
            customErrorMessage: `Kunne ikke hente ressurstilgang for: ${resourceName}`,
            customSuccessMessage: `Ressurstilgang for ${resourceName} ble hentet.`,
            additionalHeaders: headers,
        });
    });

    it('getFieldAccess calls field endpoint with headers', async () => {
        await AccessApi.getFieldAccess(clientOrAdapter, componentName, resourceName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/access/${clientOrAdapter}/component/${componentName}/resource/${resourceName}/field`,
            functionName: 'getFieldAccess',
            customErrorMessage: 'Kunne ikke hente komponenttilgang',
            customSuccessMessage: `Komponenttilgang ble hentet: ${componentName}`,
            additionalHeaders: headers,
        });
    });

    it('addAccess posts to access endpoint with headers', async () => {
        await AccessApi.addAccess(username);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: `/access/${username}`,
            functionName: 'addAccess',
            customErrorMessage: 'Kunne ikke sette opp tilgang',
            customSuccessMessage: `Tilgang ble opprettet: ${username}`,
            additionalHeaders: headers,
        });
    });

    it('deleteAccess deletes access endpoint with headers', async () => {
        await AccessApi.deleteAccess(username);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/access/${username}`,
            functionName: 'deleteAccess',
            customErrorMessage: 'Kunne ikke slette tilgang',
            customSuccessMessage: `Tilgang ble slettet: ${username}`,
            additionalHeaders: headers,
        });
    });

    it('updateEnvironments patches environments payload', async () => {
        const environments = ['prod', 'beta'];

        await AccessApi.updateEnvironments(username, environments);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PATCH',
            endpoint: `/access/${username}`,
            functionName: 'updateEnvironments',
            body: JSON.stringify({ environments }),
            customErrorMessage: 'Kunne ikke endre miljøer',
            customSuccessMessage: 'Miljøer ble oppdatert',
            additionalHeaders: headers,
        });
    });

    it('addComponentAccess enables component when enabled is true', async () => {
        await AccessApi.addComponentAccess(username, componentName, 'true');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${componentName}`,
            functionName: 'addComponentAccess',
            body: JSON.stringify({ enabled: 'true' }),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: 'Tilgang ble lagt til',
            additionalHeaders: headers,
        });
    });

    it('addComponentAccess disables component when enabled is not true', async () => {
        await AccessApi.addComponentAccess(username, componentName, 'false');

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${componentName}`,
            functionName: 'addComponentAccess',
            body: JSON.stringify({ enabled: 'false' }),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: 'Tilgang ble fjernet ',
            additionalHeaders: headers,
        });
    });

    it('updateResources patches single resource with singular success message', async () => {
        const resources = [
            {
                component: componentName,
                resource: resourceName,
                enabled: true,
                writeable: false,
                readingOption: null,
            },
        ];

        await AccessApi.updateResources(username, componentName, resources);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${componentName}/resource`,
            functionName: 'updateResources',
            body: JSON.stringify(resources),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: 'Tilgang ble oppdatert',
            additionalHeaders: headers,
        });
    });

    it('updateResources patches multiple resources with plural success message', async () => {
        const resources = [
            {
                component: componentName,
                resource: resourceName,
                enabled: true,
                writeable: false,
                readingOption: null,
            },
            {
                component: componentName,
                resource: 'resource-b',
                enabled: false,
                writeable: true,
                readingOption: 'ALL',
            },
        ];

        await AccessApi.updateResources(username, componentName, resources);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${componentName}/resource`,
            functionName: 'updateResources',
            body: JSON.stringify(resources),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: 'Tilgang ble oppdatert alle',
            additionalHeaders: headers,
        });
    });

    it('updateFieldAccess patches field enabled state', async () => {
        await AccessApi.updateFieldAccess(
            username,
            componentName,
            resourceName,
            fieldName,
            'true'
        );

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${componentName}/resource/${resourceName}/field/${fieldName}`,
            functionName: 'updateFieldAccess',
            body: JSON.stringify({ enabled: 'true' }),
            customErrorMessage: 'Kunne ikke oppdatere tilgang',
            customSuccessMessage: 'Tilgang ble oppdatert',
            additionalHeaders: headers,
        });
    });

    it('addFieldAccess patches field list payload', async () => {
        const fields = [{ name: fieldName, enabled: true, mustContain: 'value' }];

        await AccessApi.addFieldAccess(username, componentName, resourceName, fields);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PATCH',
            endpoint: `/access/${username}/component/${componentName}/resource/${resourceName}/field`,
            functionName: 'addFieldAccess',
            body: JSON.stringify(fields),
            customErrorMessage: 'Kunne ikke oppdatere felttilganger',
            customSuccessMessage: 'Felttilganger ble oppdatert',
            additionalHeaders: headers,
        });
    });

    it('getAccessAudit calls audit endpoint with headers', async () => {
        await AccessApi.getAccessAudit(username);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/access/${username}/audit`,
            functionName: 'getAccessAudit',
            customErrorMessage: 'Kunne ikke hente endringslogg',
            customSuccessMessage: 'Endringslogg hentet',
            additionalHeaders: headers,
        });
    });

    it('getAccessLogs calls access-log endpoint with headers', async () => {
        await AccessApi.getAccessLogs(username);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/access-log/${username}`,
            functionName: 'getAccessLogs',
            customErrorMessage: 'Kunne ikke hente tilgangslogg',
            customSuccessMessage: 'Tilgangslogg hentet',
            additionalHeaders: headers,
        });
    });
});
