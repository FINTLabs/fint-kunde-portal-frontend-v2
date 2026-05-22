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

import OrganisationApi from './OrganisationApi';

describe('OrganisationApi', () => {
    const organisationName = 'fint-org';
    const componentName = 'component-a';

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('getTechnicalContacts calls expected endpoint with headers', async () => {
        await OrganisationApi.getTechnicalContacts(organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/organisations/${organisationName}/contacts/technical`,
            functionName: 'getTechnicalContacts',
            customErrorMessage: `Kunne ikke hente tekniske kontakter for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Tekniske kontakter hentet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getLegalContact calls expected endpoint with headers', async () => {
        await OrganisationApi.getLegalContact(organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/organisations/${organisationName}/contacts/legal`,
            functionName: 'getLegalContact',
            customErrorMessage: `Kunne ikke hente juridisk kontakt for organisasjonen: ${organisationName}`,
            customSuccessMessage: 'Juridisk kontakt hentet vellykket',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateComponent adds component when checked', async () => {
        await OrganisationApi.updateComponent(componentName, organisationName, true);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/organisations/${organisationName}/components/${componentName}`,
            functionName: 'addComponentToOrganisation',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke legge til komponenten: ${componentName}`,
            customSuccessMessage: `Komponenten ${componentName} ble lagt til`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('updateComponent removes component when not checked', async () => {
        await OrganisationApi.updateComponent(componentName, organisationName, false);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/organisations/${organisationName}/components/${componentName}`,
            functionName: 'removeComponentFromOrganisation',
            body: JSON.stringify({ name: componentName }),
            customErrorMessage: `Kunne ikke fjerne komponenten: ${componentName}`,
            customSuccessMessage: `Komponenten ${componentName} ble fjernet`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
