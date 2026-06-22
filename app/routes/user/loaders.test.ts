import { beforeEach, describe, expect, it, vi } from 'vitest';

import MeApi from '~/api/MeApi';
import { IMeData } from '~/types/Me';

import { loader } from './route';

vi.mock('~/api/MeApi');

describe('user loader', () => {
    const mockUser: IMeData = {
        dn: 'cn=Test User,ou=users',
        nin: '12345678901',
        firstName: 'Test',
        lastName: 'User',
        mail: 'test.user@example.com',
        mobile: '12345678',
        technical: [],
        legal: [],
        supportId: 'support-1',
        roles: ['ROLE_ADMIN@fint-org'],
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns user data from MeApi.fetchMe', async () => {
        vi.mocked(MeApi.fetchMe).mockResolvedValue(mockUser);

        const response = (await loader()) as Response;
        const data = await response.json();

        expect(MeApi.fetchMe).toHaveBeenCalledTimes(1);
        expect(data).toEqual({ user: mockUser });
    });

    it('rethrows when MeApi.fetchMe fails', async () => {
        vi.mocked(MeApi.fetchMe).mockRejectedValue(new Error('boom'));

        await expect(loader()).rejects.toThrow('boom');
    });
});
