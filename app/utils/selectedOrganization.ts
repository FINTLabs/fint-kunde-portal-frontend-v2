import { IUserSession } from '~/types/types';
import { getSession } from './session';

export async function getSelectedOprganization(request: Request) {
    const session = await getSession(request.headers.get('Cookie'));
    const userSession: IUserSession | undefined = session.get('user-session');

    if (!userSession) throw new Response('Unauthorized', { status: 401 });
    if (!userSession.selectedOrganization)
        throw new Response('User selected organization is undefined', { status: 404 });

    return userSession.selectedOrganization.name;
}
