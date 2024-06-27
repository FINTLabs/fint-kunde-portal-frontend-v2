import { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getSession, destroySession } from '~/utils/session';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get('Cookie'));
    const cookieHeader = await destroySession(session);

    return redirect('https://idp.felleskomponent.no/nidp/app/logout', {
        headers: {
            'Set-Cookie': cookieHeader,
        },
    });
};

export default function Logout() {
    return null;
}
