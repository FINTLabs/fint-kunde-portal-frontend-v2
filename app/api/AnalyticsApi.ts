import { NovariApiManager } from 'novari-frontend-components';

const apiManager = new NovariApiManager({
    baseUrl: '',
});

const apiActionManager = new NovariApiManager({
    baseUrl: 'http://fint-analytics-frontend:3000',
});

const APP_NAME = 'kunde-portal';

type TrackEventType = 'page_view' | 'button_click' | 'search' | 'error' | 'action';

type TrackEventParams = {
    type: TrackEventType;
    path?: string;
    element?: string;
    tenant?: string;
    meta?: unknown;
};

class AnalyticsApi {
    private static createBody(params: TrackEventParams) {
        return {
            app: APP_NAME,
            type: params.type,
            path: params.path ?? null,
            element: params.element ?? null,
            tenant: params.tenant ?? null,
            meta: params.meta ?? null,
        };
    }

    private static async sendEvent(
        params: TrackEventParams,
        manager: NovariApiManager = apiManager
    ) {
        const functionName = `trackEvent:${params.type.replace('_', '-')}`;

        return manager.call({
            method: 'POST',
            endpoint: '/api/events',
            functionName,
            body: this.createBody(params),
            additionalHeaders: {
                'x-analytics-token': 'change-me',
            },
        });
    }

    static async trackEvent(params: TrackEventParams) {
        return this.sendEvent(params, apiManager);
    }

    static async trackActionEvent(params: TrackEventParams) {
        return this.sendEvent(params, apiActionManager);
    }

    static async trackButtonClick(element: string, path: string, tenant?: string, meta?: unknown) {
        return this.trackEvent({
            type: 'button_click',
            path,
            element,
            tenant: tenant ?? '',
            meta: meta ?? null,
        });
    }

    static async trackSearch(path: string, meta: Record<string, unknown>, tenant?: string) {
        return this.trackEvent({
            type: 'search',
            path,
            tenant: tenant ?? '',
            meta,
        });
    }

    static async trackError(
        path: string,
        message: string,
        statusCode: number,
        tenant?: string,
        action?: string
    ) {
        return this.trackEvent({
            type: 'error',
            path,
            tenant,
            meta: {
                message,
                status: statusCode,
                action,
            },
        });
    }

    static async trackActionError(
        path: string,
        message: string,
        statusCode: number,
        tenant?: string,
        action?: string
    ) {
        return this.trackActionEvent({
            type: 'error',
            path,
            tenant,
            meta: {
                message,
                status: statusCode,
                action,
            },
        });
    }
}

export default AnalyticsApi;
