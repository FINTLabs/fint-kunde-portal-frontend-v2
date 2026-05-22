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

import RoleApi from './RolesApi';

describe('RoleApi', () => {
    const orgName = 'fint-org';
    const contactNin = '12345678901';
    const roleId = 'role-id';
    const roleName = 'Admin';

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('10987654321');
        mockCall.mockResolvedValue({ success: true, data: {} });
    });

    it('getRoles calls expected endpoint with headers', async () => {
        await RoleApi.getRoles();

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/api/role',
            functionName: 'getRoles',
            customErrorMessage: 'Kunne ikke hente roller',
            customSuccessMessage: 'Roller hentet vellykket',
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
    });

    it('addRole calls expected endpoint with headers', async () => {
        await RoleApi.addRole(orgName, contactNin, roleId, roleName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'PUT',
            endpoint: `/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`,
            functionName: 'addRole',
            customErrorMessage: `Feil ved oppdatering av kontaktrolle: ${roleName}`,
            customSuccessMessage: `Kontaktroller oppdatert: ${roleName}`,
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
    });

    it('removeRole calls expected endpoint with headers', async () => {
        await RoleApi.removeRole(orgName, contactNin, roleId, roleName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'DELETE',
            endpoint: `/api/organisations/${orgName}/contacts/roles/${contactNin}/${roleId}`,
            functionName: 'removeRole',
            customErrorMessage: `Feil ved fjerning av kontaktrolle: ${roleName}`,
            customSuccessMessage: `Kontaktrolle fjernet: ${roleName}`,
            additionalHeaders: {
                'x-nin': '10987654321',
            },
        });
    });
});
