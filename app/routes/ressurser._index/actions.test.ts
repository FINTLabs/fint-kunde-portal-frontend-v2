import { beforeEach, describe, expect, it, vi } from 'vitest';

import AssetApi from '~/api/AssetApi';

import { handleAssetIndexAction } from './actions';

vi.mock('~/api/AssetApi');

describe('handleAssetIndexAction', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request('http://localhost/ressurser', {
            method: 'POST',
            body,
        });
    }

    it('creates asset and redirects on success', async () => {
        vi.mocked(AssetApi.createAsset).mockResolvedValue({
            success: true,
            data: { name: 'asset-a' },
        } as any);

        const response = await handleAssetIndexAction({
            request: createRequest({
                name: 'asset-a',
                description: 'Asset description',
                orgName: 'fint-org',
            }),
        });

        expect(AssetApi.createAsset).toHaveBeenCalledWith(
            {
                assetId: 'asset-a',
                name: 'asset-a',
                description: 'Asset description',
            },
            'fint-org'
        );
        expect(response).toBeInstanceOf(Response);
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe('/ressurser/asset-a');
    });

    it('throws 404 when asset creation fails', async () => {
        vi.mocked(AssetApi.createAsset).mockResolvedValue({
            success: false,
        } as any);

        await expect(
            handleAssetIndexAction({
                request: createRequest({
                    name: 'asset-a',
                    description: 'Asset description',
                    orgName: 'fint-org',
                }),
            })
        ).rejects.toMatchObject({
            data: 'Record Not Found',
            init: { status: 404 },
        });
    });
});
