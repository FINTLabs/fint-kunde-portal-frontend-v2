export function parseCookie(cookieHeader: string | null) {
    const cookies: { [key: string]: string } = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach((cookie) => {
            const [name, ...rest] = cookie.split('=');
            cookies[name.trim()] = decodeURIComponent(rest.join('='));
        });
    }
    return cookies;
}
