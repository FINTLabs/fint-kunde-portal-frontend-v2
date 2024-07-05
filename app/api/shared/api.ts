import { error, log } from '~/utils/logger';

export async function fetchData(URL: string, functionName: string, returnType = 'json') {
    try {
        log(`Fetching ${functionName}`, URL);
        const response = await fetch(URL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
            },
        });
        if (response.ok) {
            return returnType === 'json' ? await response.json() : await response.text();
        } else {
            error(`Error fetching ${functionName}, status:`, response.status);
            return null;
        }
    } catch (err) {
        error(`Error fetching ${functionName}:`, err);
        throw new Error(`Error fetching ${functionName}`);
    }
}
