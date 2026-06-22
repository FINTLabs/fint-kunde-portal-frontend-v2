import { beforeEach, describe, expect, it, vi } from 'vitest';

import AdapterAPI from '~/api/AdapterApi';
import AssetApi from '~/api/AssetApi';
import ClientApi from '~/api/ClientApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { loader } from './loaders';

vi.mock('~/api/AdapterApi');
vi.mock('~/api/AssetApi');
vi.mock('~/api/ClientApi');
vi.mock('~/utils/selectedOrganization');

function makeAsset() {
    return {
        dn: 'dn-asset-1',
        name: 'asset-a',
        assetId: 'asset-id-1',
        description: 'Asset description',
        organisation: 'fint-org',
        clients: [],
        adapters: [],
        primaryAsset: false,
    };
}

describe('ressurser detail loader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns asset, adapters, clients and assets', async () => {
        const asset = makeAsset();
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AssetApi.getAssetById).mockResolvedValue({ data: asset } as any);
        vi.mocked(AdapterAPI.getAdapters).mockResolvedValue({ data: [{ name: 'adapter-a' }] } as any);
        vi.mocked(ClientApi.getClients).mockResolvedValue({ data: [{ name: 'client-a' }] } as any);
        vi.mocked(AssetApi.getAllAssets).mockResolvedValue({ data: [asset] } as any);

        const request = new Request('http://localhost/ressurser/asset-a');
        const response = (await loader({ request, params: { id: 'asset-a' } } as any)) as Response;
        const data = await response.json();

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(AssetApi.getAssetById).toHaveBeenCalledWith('fint-org', 'asset-a');
        expect(AdapterAPI.getAdapters).toHaveBeenCalledWith('fint-org');
        expect(ClientApi.getClients).toHaveBeenCalledWith('fint-org');
        expect(AssetApi.getAllAssets).toHaveBeenCalledWith('fint-org');
        expect(data).toEqual({
            asset,
            adapters: [{ name: 'adapter-a' }],
            clients: [{ name: 'client-a' }],
            assets: [asset],
        });
    });

    it('uses empty id when params.id is missing', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(AssetApi.getAssetById).mockResolvedValue({ data: null } as any);
        vi.mocked(AdapterAPI.getAdapters).mockResolvedValue({ data: [] } as any);
        vi.mocked(ClientApi.getClients).mockResolvedValue({ data: [] } as any);
        vi.mocked(AssetApi.getAllAssets).mockResolvedValue({ data: [] } as any);

        await loader({ request: new Request('http://localhost/ressurser'), params: {} } as any);

        expect(AssetApi.getAssetById).toHaveBeenCalledWith('fint-org', '');
    });
});
