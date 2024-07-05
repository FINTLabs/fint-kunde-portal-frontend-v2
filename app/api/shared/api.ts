import { error, log } from '~/utils/logger';

function getFetchOptions(): RequestInit {
    return {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'x-nin': process.env.PERSONALNUMBER || '',
        },
    };
}

export async function fetchData(URL: string, functionName: string) {
    try {
        log(`Fetching ${functionName}`, URL);

        const response = await fetch(URL, getFetchOptions());
        if (response.ok) {
            return await response.json();
        } else {
            error(`Error fetching ${functionName}, status:`, response.status);
            return null;
        }
    } catch (err) {
        error(`Error fetching ${functionName}:`, err);
        throw new Error(`Error fetching ${functionName}`);
    }
}
