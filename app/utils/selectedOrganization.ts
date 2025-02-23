import { selectOrgCookie } from '~/utils/cookie';

//TODO: remove this file?
export async function getSelectedOrganization(request: Request) {
    // const userSession: IUserSession | undefined = await getUserSession(request);
    // if (!userSession) throw new Response('Unauthorized', { status: 401 });
    // if (!userSession.selectedOrganization)
    //     throw new Response('User selected organization is undefined', { status: 404 });
    //
    // console.debug(`USER SESSION ORG: ${JSON.stringify(userSession.selectedOrganization)}`);
    const cookieHeader = request.headers.get('Cookie');
    return await selectOrgCookie.parse(cookieHeader);
}
//
// export async function getSessionFromCookie(request: Request) {
//     return await getSession(request.headers.get('Cookie'));
// }
//
// export async function getUserSession(request: Request) {
//     const session = await getSessionFromCookie(request);
//     const sessionVariable = request.url.includes('localhost') ? 'user-session' : 'user_session';
//     const userSession: IUserSession | undefined = session.get(sessionVariable);
//     return userSession;
// }
//
// export async function setUserSession(request: Request, userSession: IUserSession) {
//     const session = await getSessionFromCookie(request);
//     const sessionVariable = request.url.includes('localhost') ? 'user-session' : 'user_session';
//     session.set(sessionVariable, userSession);
//     return session;
// }
