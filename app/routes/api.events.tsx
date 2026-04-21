// app/routes/api.events.ts
import type { ActionFunctionArgs } from 'react-router';

const ANALYTICS_INTERNAL_URL = process.env.ANALYTICS_URL ?? 'http://fint-analytics-frontend:3000';

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    const body = await request.text();

    const upstream = await fetch(`${ANALYTICS_INTERNAL_URL}/api/events`, {
        method: 'POST',
        headers: {
            'content-type': request.headers.get('content-type') ?? 'application/json',
            // forward your token header if analytics expects it
            'x-analytics-token': request.headers.get('x-analytics-token') ?? '',
        },
        body,
    });

    return new Response(await upstream.text(), {
        status: upstream.status,
        headers: {
            'content-type': upstream.headers.get('content-type') ?? 'application/json',
        },
    });
}
