import { error, log } from '~/utils/logger';

export async function request(
    URL: string,
    functionName: string,
    requestMethod = 'GET',
    returnType = 'json'
) {
    try {
        log(`Running ${functionName}`, URL);
        const response = await fetch(URL, {
            method: requestMethod,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
            },
        });
        if (response.ok) {
            return returnType === 'json' ? await response.json() : await response.text();
        } else {
            error(`Error running ${functionName}, status:`, response.status);
            return null;
        }
    } catch (err) {
        error(`Error running ${functionName}:`, err);
        throw new Error(`Error running ${functionName}`);
    }
}
