import { error, log } from '~/utils/logger';

export async function fetchData(URL: string, functionName: string, returnType = 'json') {
    try {
        log(`Fetching ${functionName}`, URL);
        console.log(`returnType: `, returnType);
        const response = await fetch(URL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
            },
        });
        if (response.ok) {
            if (returnType === 'json') {
                return await response.json();
            } else {
                return await response.text();
            }
        } else {
            error(`Error fetching ${functionName}, status:`, response.status);
            return null;
        }
    } catch (err) {
        error(`Error fetching ${functionName}:`, err);
        throw new Error(`Error fetching ${functionName}`);
    }
}
