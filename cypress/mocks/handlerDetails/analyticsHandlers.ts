import { http, HttpResponse } from 'msw';

export const analyticsHandlers = [
    http.post('/api/events', async ({ request }) => {
        console.log('Mocked analytics event received');
        const body = await request.json();

        console.log('body:', body);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),
];
