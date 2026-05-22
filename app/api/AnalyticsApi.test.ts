import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockCall } = vi.hoisted(() => {
    return {
        mockCall: vi.fn(),
    };
});

vi.mock('novari-frontend-components', () => {
    class MockNovariApiManager {
        private readonly baseUrl: string;

        constructor(config: { baseUrl: string }) {
            this.baseUrl = config.baseUrl;
        }

        call(params: unknown) {
            return mockCall({
                ...(params as object),
                managerBaseUrl: this.baseUrl,
            });
        }
    }

    return {
        NovariApiManager: MockNovariApiManager,
    };
});

import AnalyticsApi from './AnalyticsApi';

describe('AnalyticsApi', () => {
    beforeEach(() => {
        mockCall.mockReset();
        mockCall.mockResolvedValue({ success: true });
    });

    it('trackEvent posts analytics event through default manager', async () => {
        await AnalyticsApi.trackEvent({
            type: 'page_view',
            path: '/komponenter',
            tenant: 'fint-org',
        });

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: '/api/events',
            functionName: 'trackEvent:page-view',
            body: {
                app: 'kunde-portal',
                type: 'page_view',
                path: '/komponenter',
                element: null,
                tenant: 'fint-org',
                meta: null,
            },
            additionalHeaders: {
                'x-analytics-token': 'change-me',
            },
            managerBaseUrl: '',
        });
    });

    it('trackActionEvent posts analytics event through action manager', async () => {
        await AnalyticsApi.trackActionEvent({
            type: 'action',
            path: '/adaptere',
            element: 'save',
            tenant: 'fint-org',
            meta: { result: 'ok' },
        });

        expect(mockCall).toHaveBeenCalledWith({
            method: 'POST',
            endpoint: '/api/events',
            functionName: 'trackEvent:action',
            body: {
                app: 'kunde-portal',
                type: 'action',
                path: '/adaptere',
                element: 'save',
                tenant: 'fint-org',
                meta: { result: 'ok' },
            },
            additionalHeaders: {
                'x-analytics-token': 'change-me',
            },
            managerBaseUrl: 'http://fint-analytics-frontend:3000',
        });
    });

    it('trackButtonClick fills button click event defaults', async () => {
        await AnalyticsApi.trackButtonClick('save-button', '/clients');

        expect(mockCall).toHaveBeenCalledWith(
            expect.objectContaining({
                functionName: 'trackEvent:button-click',
                body: expect.objectContaining({
                    type: 'button_click',
                    path: '/clients',
                    element: 'save-button',
                    tenant: '',
                    meta: null,
                }),
            })
        );
    });

    it('trackSearch sends search metadata', async () => {
        await AnalyticsApi.trackSearch('/logs', { query: 'adapter' }, 'fint-org');

        expect(mockCall).toHaveBeenCalledWith(
            expect.objectContaining({
                functionName: 'trackEvent:search',
                body: expect.objectContaining({
                    type: 'search',
                    path: '/logs',
                    tenant: 'fint-org',
                    meta: { query: 'adapter' },
                }),
            })
        );
    });

    it('trackError sends error metadata', async () => {
        await AnalyticsApi.trackError('/me', 'Server error', 500, 'fint-org', 'load');

        expect(mockCall).toHaveBeenCalledWith(
            expect.objectContaining({
                functionName: 'trackEvent:error',
                body: expect.objectContaining({
                    type: 'error',
                    path: '/me',
                    tenant: 'fint-org',
                    meta: {
                        message: 'Server error',
                        status: 500,
                        action: 'load',
                    },
                }),
                managerBaseUrl: '',
            })
        );
    });

    it('trackActionError sends error through action manager', async () => {
        await AnalyticsApi.trackActionError('/adaptere', 'Action failed', 400);

        expect(mockCall).toHaveBeenCalledWith(
            expect.objectContaining({
                functionName: 'trackEvent:error',
                body: expect.objectContaining({
                    type: 'error',
                    path: '/adaptere',
                    tenant: null,
                    meta: {
                        message: 'Action failed',
                        status: 400,
                        action: undefined,
                    },
                }),
                managerBaseUrl: 'http://fint-analytics-frontend:3000',
            })
        );
    });
});
