import { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getSession, destroySession } from '~/utils/session';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get('Cookie'));
    // const userSession = session.get('user-session') || session.get('user_session');

    // Save the selected organization in a persistent cookie before destroying the session
    // let selectedOrganizationCookie = '';
    // if (userSession && userSession.selectedOrganization) {
    //     selectedOrganizationCookie = `selectedOrganization=${userSession.selectedOrganization.orgNumber}; Path=/; HttpOnly; Max-Age=31536000`; // 1 year expiration
    // }

    const cookieHeader = await destroySession(session);

    return redirect('https://idp.felleskomponent.no/nidp/app/logout', {
        headers: {
            // 'Set-Cookie': `${cookieHeader}, ${selectedOrganizationCookie}`,
            'Set-Cookie': `${cookieHeader}`,
        },
    });
};

export default function Logout() {
    return null;
}
