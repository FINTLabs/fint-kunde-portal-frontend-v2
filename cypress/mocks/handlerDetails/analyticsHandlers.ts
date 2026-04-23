import { http, HttpResponse } from 'msw';

export const analyticsHandlers = [
    http.post('http://localhost:3000/api/events', async ({ request }) => {
        console.log('Mocked analytics event received');
        const body = await request.json();

        console.log('body:', body);
        return HttpResponse.json({ success: true }, { status: 200 });
    }),
];
