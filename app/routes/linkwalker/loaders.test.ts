import { beforeEach, describe, expect, it, vi } from 'vitest';

import LinkWalkerIntegrationApi from '~/api/LinkWalkerIntegrationApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './route';

vi.mock('~/api/LinkWalkerIntegrationApi');
vi.mock('~/utils/selectedOrganization');

describe('linkwalker loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns summary and selected organization', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(LinkWalkerIntegrationApi.getSummary).mockResolvedValue({
            data: {
                scanCompletedAt: '2024-01-01T10:00:00Z',
                orgId: 'fint-org',
                components: ['comp-a'],
                summary: {
                    totalRecords: 100,
                    totalRefs: 200,
                    brokenLinkCount: 5,
                    integrityPercent: 97.5,
                    byProblemType: {},
                    components: [],
                },
            },
        } as any);

        const request = new Request('http://localhost/linkwalker');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(LinkWalkerIntegrationApi.getSummary).toHaveBeenCalledWith('fint-org');
        expect(data.orgName).toBe('fint-org');
        expect(data.summary.scanCompletedAt).toBe('2024-01-01T10:00:00Z');
    });

    it('rethrows when LinkWalkerIntegrationApi.getSummary fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(LinkWalkerIntegrationApi.getSummary).mockRejectedValue(new Error('boom'));

        await expect(
            loader({ request: new Request('http://localhost/linkwalker') } as any)
        ).rejects.toThrow('boom');
    });
});
