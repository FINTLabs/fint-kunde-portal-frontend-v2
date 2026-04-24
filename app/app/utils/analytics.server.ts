const ANALYTICS_INTERNAL_URL = process.env.ANALYTICS_URL ?? 'http://fint-analytics-frontend:3000';

export async function trackActionFromServer(params: {
    path: string;
    element: string;
    type: string;
    tenant?: string;
    meta?: Record<string, unknown>;
}) {
    await fetch(`${ANALYTICS_INTERNAL_URL}/api/events`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-analytics-token': 'change-me',
        },
        body: JSON.stringify({
            app: 'kunde-portal',
            type: params.type,
            path: params.path,
            element: params.element,
            tenant: params.tenant ?? null,
            meta: params.meta ?? null,
        }),
    });
}
