import { beforeEach, describe, expect, it, vi } from 'vitest';

import ContactApi from '~/api/ContactApi';
import OrganisationApi from '~/api/OrganisationApi';
import RoleApi from '~/api/RolesApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/ContactApi');
vi.mock('~/api/OrganisationApi');
vi.mock('~/api/RolesApi');
vi.mock('~/utils/selectedOrganization');

describe('kontakter loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns sorted contacts, roles, legal contact and selected org', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ContactApi.getTechnicalContacts).mockResolvedValue({
            success: true,
            data: [
                { firstName: 'Zoe', lastName: 'Zulu' },
                { firstName: 'Anna', lastName: 'Alpha' },
            ],
        } as any);
        vi.mocked(RoleApi.getRoles).mockResolvedValue({
            data: [{ id: 'ROLE_USER', name: 'Bruker' }],
        } as any);
        vi.mocked(OrganisationApi.getLegalContact).mockResolvedValue({
            data: { firstName: 'Legal', lastName: 'Contact' },
        } as any);
        vi.mocked(ContactApi.getAllContacts).mockResolvedValue({
            data: [{ firstName: 'All', lastName: 'Contacts' }],
        } as any);

        const request = new Request('http://localhost/kontakter');
        const data = await loader({ request } as any);

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(data).toEqual({
            technicalContacts: [
                { firstName: 'Anna', lastName: 'Alpha' },
                { firstName: 'Zoe', lastName: 'Zulu' },
            ],
            rolesData: [{ id: 'ROLE_USER', name: 'Bruker' }],
            legalContact: { firstName: 'Legal', lastName: 'Contact' },
            allContacts: [{ firstName: 'All', lastName: 'Contacts' }],
            selectedOrg: 'fint-org',
        });
    });

    it('returns empty technical contacts when API call is unsuccessful', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ContactApi.getTechnicalContacts).mockResolvedValue({
            success: false,
            data: [{ firstName: 'Ignored', lastName: 'Contact' }],
        } as any);
        vi.mocked(RoleApi.getRoles).mockResolvedValue({ data: [] } as any);
        vi.mocked(OrganisationApi.getLegalContact).mockResolvedValue({ data: null } as any);
        vi.mocked(ContactApi.getAllContacts).mockResolvedValue({ data: [] } as any);

        const data = (await loader({
            request: new Request('http://localhost/kontakter'),
        } as any)) as { technicalContacts: unknown[] };

        expect(data.technicalContacts).toEqual([]);
    });

    it('rethrows when ContactApi.getTechnicalContacts fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(ContactApi.getTechnicalContacts).mockRejectedValue(new Error('boom'));

        await expect(
            loader({ request: new Request('http://localhost/kontakter') } as any)
        ).rejects.toThrow('boom');
    });
});
