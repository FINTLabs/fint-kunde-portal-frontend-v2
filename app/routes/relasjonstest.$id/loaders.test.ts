import { beforeEach, describe, expect, it, vi } from 'vitest';

import LinkWalkerApi from '~/api/LinkWalkerApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

import { handle, loader } from './route';

vi.mock('~/api/LinkWalkerApi');
vi.mock('~/utils/selectedOrganization');

async function expectLoaderThrows(
    loaderPromise: Promise<unknown>,
    expectedStatus: number,
    expectedBody?: Record<string, string>
) {
    const thrown = await loaderPromise.catch((error: unknown) => error);

    expect(thrown).toBeInstanceOf(Response);
    const response = thrown as Response;
    expect(response.status).toBe(expectedStatus);

    if (expectedBody) {
        expect(await response.json()).toEqual(expectedBody);
    }
}

describe('relasjonstest download handle', () => {
    it('exports analytics metadata', () => {
        expect(handle).toEqual({
            analytics: {
                pageType: 'relasjonstest',
                pathPattern: '/relasjonstest/:id',
            },
        });
    });
});

describe('relasjonstest download loader', () => {
    const request = new Request('http://localhost/relasjonstest/test-1');
    const excelData = new Uint8Array([1, 2, 3, 4]).buffer;

    beforeEach(() => {
        vi.resetAllMocks();
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                arrayBuffer: () => Promise.resolve(excelData),
            })
        );
    });

    it('throws 400 when id is missing', async () => {
        await expectLoaderThrows(
            loader({ request, params: {} } as any) as Promise<unknown>,
            400,
            { error: 'Missing id parameter' }
        );

        expect(getSelectedOrganization).not.toHaveBeenCalled();
        expect(LinkWalkerApi.getLink).not.toHaveBeenCalled();
    });

    it('returns excel file with download headers', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(LinkWalkerApi.getLink).mockReturnValue('https://example.com/download.xlsx');

        const response = (await loader({
            request,
            params: { id: 'test-1' },
        } as any)) as Response;

        expect(getSelectedOrganization).toHaveBeenCalledWith(request);
        expect(LinkWalkerApi.getLink).toHaveBeenCalledWith('fint-org', 'test-1');
        expect(fetch).toHaveBeenCalledWith('https://example.com/download.xlsx');
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        expect(response.headers.get('Content-Disposition')).toBe(
            'attachment; filename="relasjonstest_test-1.xlsx"'
        );
        expect(await response.arrayBuffer()).toEqual(excelData);
    });

    it('throws 500 when download url is missing', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(LinkWalkerApi.getLink).mockReturnValue('');

        await expectLoaderThrows(
            loader({ request, params: { id: 'test-1' } } as any) as Promise<unknown>,
            500,
            { error: 'Failed to fetch Excel file' }
        );
        expect(LinkWalkerApi.getLink).toHaveBeenCalledWith('fint-org', 'test-1');
    });

    it('throws 500 when fetch response is not ok', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(LinkWalkerApi.getLink).mockReturnValue('https://example.com/download.xlsx');
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            })
        );

        await expectLoaderThrows(
            loader({ request, params: { id: 'test-1' } } as any) as Promise<unknown>,
            500,
            { error: 'Failed to fetch Excel file' }
        );
        expect(fetch).toHaveBeenCalledWith('https://example.com/download.xlsx');
    });

    it('throws 500 when fetch fails', async () => {
        vi.mocked(getSelectedOrganization).mockResolvedValue('fint-org');
        vi.mocked(LinkWalkerApi.getLink).mockReturnValue('https://example.com/download.xlsx');
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

        await expectLoaderThrows(
            loader({ request, params: { id: 'test-1' } } as any) as Promise<unknown>,
            500,
            { error: 'Failed to fetch Excel file' }
        );
        expect(fetch).toHaveBeenCalledWith('https://example.com/download.xlsx');
    });
});
