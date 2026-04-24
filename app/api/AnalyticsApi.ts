import { NovariApiManager } from 'novari-frontend-components';

const apiManager = new NovariApiManager({
    baseUrl: '',
});
const APP_NAME = 'kunde-portal';

class AnalyticsApi {
    static async trackEvent(params: {
        type: 'page_view' | 'button_click' | 'search' | 'error';
        path?: string;
        element?: string;
        tenant?: string;
        meta?: any;
    }) {
        const body = {
            app: APP_NAME,
            type: params.type,
            path: params.path ?? null,
            element: params.element ?? null,
            tenant: params.tenant ?? null,
            meta: params.meta ?? null,
        };

        return await apiManager.call({
            method: 'POST',
            endpoint: `/api/events`,
            functionName: 'trackEvent',
            body,
            additionalHeaders: {
                'x-analytics-token': 'change-me',
            },
        });
    }

    static async trackButtonClick(element: string, path: string, tenant?: string, meta?: any) {
        return this.trackEvent({
            type: 'button_click',
            path,
            element,
            tenant: tenant || '',
            meta: meta ?? null,
        });
    }

    static async trackSearch(path: string, meta: Record<string, unknown>, tenant?: string) {
        return this.trackEvent({
            type: 'search',
            path,
            tenant: tenant || '',
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
            ...(tenant && { tenant }),
            meta: {
                message: message,
                status: statusCode,
                action: action,
            },
        });
    }
}
export default AnalyticsApi;
