import { beforeEach, describe, expect, it, vi } from 'vitest';

import ContactApi from '~/api/ContactApi';
import RoleApi from '~/api/RolesApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { handleContactsAction } from './actions';

vi.mock('~/api/ContactApi');
vi.mock('~/api/RolesApi');
vi.mock('~/utils/selectedOrganization');

describe('handleContactsAction', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/kontakter', {
            method: 'POST',
            body,
        });
    }

    it('calls addTechnicalContact for ADD_TECHNICAL_CONTACT', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        const expected = { success: true };
        vi.mocked(ContactApi.addTechnicalContact).mockResolvedValue(expected as any);

        const result = await handleContactsAction(
            createRequest({
                actionType: 'ADD_TECHNICAL_CONTACT',
                contactNin: '12345678901',
            })
        );

        expect(ContactApi.addTechnicalContact).toHaveBeenCalledWith('12345678901', 'fint-org');
        expect(result).toEqual(expected);
    });

    it('calls removeTechnicalContact for REMOVE_CONTACT', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        const expected = { success: true };
        vi.mocked(ContactApi.removeTechnicalContact).mockResolvedValue(expected as any);

        const result = await handleContactsAction(
            createRequest({
                actionType: 'REMOVE_CONTACT',
                contactNin: '12345678901',
            })
        );

        expect(ContactApi.removeTechnicalContact).toHaveBeenCalledWith('12345678901', 'fint-org');
        expect(result).toEqual(expected);
    });

    it('calls setLegalContact for SET_LEGAL_CONTACT', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        const expected = { success: true };
        vi.mocked(ContactApi.setLegalContact).mockResolvedValue(expected as any);

        const result = await handleContactsAction(
            createRequest({
                actionType: 'SET_LEGAL_CONTACT',
                contactNin: '12345678901',
            })
        );

        expect(ContactApi.setLegalContact).toHaveBeenCalledWith('12345678901', 'fint-org');
        expect(result).toEqual(expected);
    });

    it('calls addRole for ADD_ROLE', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        const expected = { success: true };
        vi.mocked(RoleApi.addRole).mockResolvedValue(expected as any);

        const result = await handleContactsAction(
            createRequest({
                actionType: 'ADD_ROLE',
                contactNin: '12345678901',
                roleId: 'ROLE_USER',
                roleName: 'Bruker',
            })
        );

        expect(RoleApi.addRole).toHaveBeenCalledWith(
            'fint-org',
            '12345678901',
            'ROLE_USER',
            'Bruker'
        );
        expect(result).toEqual(expected);
    });

    it('calls removeRole for DELETE_ROLE', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        const expected = { success: true };
        vi.mocked(RoleApi.removeRole).mockResolvedValue(expected as any);

        const result = await handleContactsAction(
            createRequest({
                actionType: 'DELETE_ROLE',
                contactNin: '12345678901',
                roleId: 'ROLE_USER',
                roleName: 'Bruker',
            })
        );

        expect(RoleApi.removeRole).toHaveBeenCalledWith(
            'fint-org',
            '12345678901',
            'ROLE_USER',
            'Bruker'
        );
        expect(result).toEqual(expected);
    });

    it('returns error payload for unknown actionType', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');

        const result = await handleContactsAction(
            createRequest({
                actionType: 'UNKNOWN',
            })
        );

        expect(result).toEqual({
            success: false,
            message: "Ukjent handlingstype: 'UNKNOWN'",
            variant: 'error',
        });
    });
});
