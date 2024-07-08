import { IAdapter, IPartialAdapter } from '~/types/types';
import { isClientSide } from '~/utils/environment';
import { error, log } from '~/utils/logger';

export type ReturnType = 'text' | 'json';

export async function request(
    URL: string,
    functionName: string,
    requestMethod = 'GET',
    returnType: ReturnType = 'json',
    adapter?: IPartialAdapter
) {
    try {
        log(`Running ${functionName}`, URL);

        let requestOptions: RequestInit = {
            method: requestMethod,
            credentials: isClientSide() ? 'same-origin' : 'include',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
            },
        };

        if (requestMethod === 'PUT' && adapter) {
            requestOptions = {
                ...requestOptions,
                body: JSON.stringify({
                    name: adapter.name,
                    note: adapter.note,
                    shortDescription: adapter.shortDescription,
                }),
            };
        }

        const response = await fetch(URL, requestOptions);
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
