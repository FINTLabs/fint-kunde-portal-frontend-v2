import { beforeEach, describe, expect, it, vi } from 'vitest';

import AssetApi from '~/api/AssetApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/AssetApi');
vi.mock('~/utils/selectedOrganization');

function makeAsset(name: string) {
    return {
        dn: `dn-${name}`,
        name,
        assetId: `${name}-id`,
        description: `${name} description`,
        organisation: 'fint-org',
        clients: [],
        adapters: [],
        primaryAsset: false,
    };
}

describe('ressurser index loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns sorted assets and primary asset', async () => {
        const primaryAsset = makeAsset('primary-asset');
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AssetApi.getAllAssets).mockResolvedValue({
            success: true,
            data: [makeAsset('asset-b'), makeAsset('asset-a')],
        } as any);
        vi.mocked(AssetApi.getPrimaryAsset).mockResolvedValue({
            data: primaryAsset,
        } as any);

        const request = new Request('http://localhost/ressurser');
        const response = (await loader({ request } as any)) as Response;
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(AssetApi.getAllAssets).toHaveBeenCalledWith('fint-org');
        expect(AssetApi.getPrimaryAsset).toHaveBeenCalledWith('fint-org');
        expect(data).toEqual({
            assets: [makeAsset('asset-a'), makeAsset('asset-b')],
            primaryAsset,
        });
    });

    it('returns empty assets when API data is missing', async () => {
        const primaryAsset = makeAsset('primary-asset');
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AssetApi.getAllAssets).mockResolvedValue({
            success: true,
            data: undefined,
        } as any);
        vi.mocked(AssetApi.getPrimaryAsset).mockResolvedValue({
            data: primaryAsset,
        } as any);

        const response = (await loader({
            request: new Request('http://localhost/ressurser'),
        } as any)) as Response;
        const data = await response.json();

        expect(data).toEqual({
            assets: [],
            primaryAsset,
        });
    });

    it('throws when getAllAssets is unsuccessful', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AssetApi.getAllAssets).mockResolvedValue({
            success: false,
        } as any);
        vi.mocked(AssetApi.getPrimaryAsset).mockResolvedValue({ data: makeAsset('primary-asset') } as any);

        await expect(
            loader({ request: new Request('http://localhost/ressurser') } as any)
        ).rejects.toThrow('Kunne ikke hente ressurser for organisasjonen: fint-org');
    });

    it('rethrows when AssetApi.getAllAssets fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AssetApi.getAllAssets).mockRejectedValue(new Error('boom'));

        await expect(
            loader({ request: new Request('http://localhost/ressurser') } as any)
        ).rejects.toThrow('boom');
    });
});
