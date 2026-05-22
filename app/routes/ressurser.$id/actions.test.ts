import { beforeEach, describe, expect, it, vi } from 'vitest';

import AssetApi from '~/api/AssetApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { handleAssetAction } from './actions';

vi.mock('~/api/AssetApi');
vi.mock('~/utils/selectedOrganization');

describe('handleAssetAction', () => {
    const orgName = 'fint-org';
    const assetName = 'asset-a';
    const assetId = 'asset-id-1';

    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(getSelectedOrganization).mockResolvedValue(orgName);
    });

    function createRequest(formData: Record<string, string>): Request {
        const body = new URLSearchParams(formData);
        return new Request(`http://localhost/ressurser/${assetName}`, {
            method: 'POST',
            body,
        });
    }

    it('calls createAsset for CREATE', async () => {
        const expected = { success: true };
        vi.mocked(AssetApi.createAsset).mockResolvedValue(expected as any);

        const result = await handleAssetAction({
            request: createRequest({
                actionType: 'CREATE',
                assetId,
                assetDescription: 'New asset',
            }),
        });

        expect(AssetApi.createAsset).toHaveBeenCalledWith(
            { name: assetId, description: 'New asset' },
            orgName
        );
        expect(result).toEqual(expected);
    });

    it('calls updateAsset for UPDATE', async () => {
        const expected = { success: true };
        vi.mocked(AssetApi.updateAsset).mockResolvedValue(expected as any);

        const result = await handleAssetAction({
            request: createRequest({
                actionType: 'UPDATE',
                assetId,
                assetDescription: 'Updated asset',
            }),
        });

        expect(AssetApi.updateAsset).toHaveBeenCalledWith(
            { name: assetId, assetId, description: 'Updated asset' },
            orgName
        );
        expect(result).toEqual(expected);
    });

    it('redirects after successful DELETE', async () => {
        vi.mocked(AssetApi.deleteAsset).mockResolvedValue({ success: true } as any);

        const result = await handleAssetAction({
            request: createRequest({
                actionType: 'DELETE',
                assetName,
            }),
        });

        expect(AssetApi.deleteAsset).toHaveBeenCalledWith(assetName, orgName);

        if (!(result instanceof Response)) {
            throw new Error('Expected redirect response');
        }

        expect(result.status).toBe(302);
        expect(result.headers.get('Location')).toBe(`/ressurser?deleted=${assetName}`);
    });

    it('returns delete response when DELETE fails', async () => {
        const expected = { success: false, message: 'failed' };
        vi.mocked(AssetApi.deleteAsset).mockResolvedValue(expected as any);

        const result = await handleAssetAction({
            request: createRequest({
                actionType: 'DELETE',
                assetName,
            }),
        });

        expect(result).toEqual(expected);
    });

    it('calls updateAdapterInAsset for UPDATE_ADAPTER', async () => {
        const expected = { success: true };
        vi.mocked(AssetApi.updateAdapterInAsset).mockResolvedValue(expected as any);

        const result = await handleAssetAction({
            request: createRequest({
                actionType: 'UPDATE_ADAPTER',
                adapterName: 'adapter-a',
                assetName,
                updateType: 'add',
            }),
        });

        expect(AssetApi.updateAdapterInAsset).toHaveBeenCalledWith(
            'adapter-a',
            assetName,
            orgName,
            'add'
        );
        expect(result).toEqual(expected);
    });

    it('calls updateClientInAsset for UPDATE_CLIENT', async () => {
        const expected = { success: true };
        vi.mocked(AssetApi.updateClientInAsset).mockResolvedValue(expected as any);

        const result = await handleAssetAction({
            request: createRequest({
                actionType: 'UPDATE_CLIENT',
                clientName: 'client-a',
                assetName,
                updateType: 'remove',
            }),
        });

        expect(AssetApi.updateClientInAsset).toHaveBeenCalledWith(
            'client-a',
            assetName,
            orgName,
            'remove'
        );
        expect(result).toEqual(expected);
    });

    it('returns error payload for unknown actionType', async () => {
        const result = await handleAssetAction({
            request: createRequest({
                actionType: 'UNKNOWN',
            }),
        });

        expect(result).toEqual({
            success: false,
            message: "Ukjent handlingstype: 'UNKNOWN'",
            variant: 'error',
        });
    });
});
