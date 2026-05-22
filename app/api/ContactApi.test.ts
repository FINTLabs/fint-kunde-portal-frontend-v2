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

import ContactApi from './ContactApi';

describe('ContactApi', () => {
    const orgName = 'fint-org';
    const contactNin = '12345678901';

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('10987654321');
        mockCall.mockResolvedValue({ success: true, data: [] });
    });

    it('getAllContacts calls expected endpoint with headers', async () => {
        await ContactApi.getAllContacts();

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/api/contacts',
            functionName: 'getAllContacts',
            customErrorMessage: 'Kunne ikke hente en liste over kontakter',
            customSuccessMessage: 'Kontakter hentet vellykket',
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
    });

    it('getTechnicalContacts calls expected endpoint with headers', async () => {
        await ContactApi.getTechnicalContacts(orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/organisations/${orgName}/contacts/technical`,
            functionName: 'getTechnicalContacts',
            customErrorMessage: 'Kunne ikke hente en liste over tekniske kontakter',
            customSuccessMessage: 'Tekniske kontakter hentet vellykket',
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
    });

    it('unsetLegalContact calls expected endpoint with headers', async () => {
        await ContactApi.unsetLegalContact(contactNin, orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/organisations/${orgName}/contacts/legal/${contactNin}`,
            functionName: 'unsetLegalContact',
            customErrorMessage: 'Kunne ikke fjerne den juridiske kontakten',
            customSuccessMessage: 'Juridisk kontakt fjernet',
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
    });

    it('setLegalContact unsets existing legal contact before setting a new one', async () => {
        await ContactApi.setLegalContact(contactNin, orgName);

        expect(mockCall).toHaveBeenNthCalledWith(1, {
            method: 'DELETE',
            endpoint: `/api/organisations/${orgName}/contacts/legal/${contactNin}`,
            functionName: 'unsetLegalContact',
            customErrorMessage: 'Kunne ikke fjerne den juridiske kontakten',
            customSuccessMessage: 'Juridisk kontakt fjernet',
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
        expect(mockCall).toHaveBeenNthCalledWith(2, {
            method: 'PUT',
            endpoint: `/api/organisations/${orgName}/contacts/legal/${contactNin}`,
            functionName: 'setLegalContact',
            customErrorMessage: 'Kunne ikke oppdatere den juridiske kontakten',
            customSuccessMessage: 'Juridisk kontakt oppdatert',
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
    });

    it('addTechnicalContact calls expected endpoint with headers', async () => {
        await ContactApi.addTechnicalContact(contactNin, orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/organisations/${orgName}/contacts/technical/${contactNin}`,
            functionName: 'addTechnicalContact',
            customErrorMessage: 'Kunne ikke legge til teknisk kontakt',
            customSuccessMessage: 'Teknisk kontakt lagt til',
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
    });

    it('removeTechnicalContact calls expected endpoint with warning variant', async () => {
        await ContactApi.removeTechnicalContact(contactNin, orgName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/organisations/${orgName}/contacts/technical/${contactNin}`,
            functionName: 'removeTechnicalContact',
            customErrorMessage: 'Kunne ikke fjerne den tekniske kontakten',
            customSuccessMessage: 'Teknisk kontakt fjernet',
            additionalHeaders: {
                'x-nin': '10987654321',
            },
            customSuccessVariant: 'warning',
        });
    });
});
