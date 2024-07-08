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

        if (requestMethod === 'GET') {
            return await getRequest(URL, functionName, requestOptions, returnType);
        }
        if (requestMethod === 'POST') {
            return await postRequest(URL, functionName, requestOptions, adapter);
        }
    } catch (err) {
        error(`Error running ${functionName}:`, err);
        throw new Error(`Error running ${functionName}`);
    }
}

export async function postRequest(
    URL: string,
    functionName: string,
    requestOptions: RequestInit,
    adapter?: IPartialAdapter
) {
    if (adapter) {
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
    if (response.status === 201 && adapter) {
        return 'Opprettet adapteret ' + adapter.name;
    } else if (response.status === 302 && adapter) {
        return 'Adaptere finnes fra før av ' + adapter.name;
    } else {
        error(`Error running ${functionName}, status:`, response.status);
        return null;
    }
}

async function getRequest(
    URL: string,
    functionName: string,
    requestOptions: RequestInit,
    returnType: ReturnType
) {
    const response = await fetch(URL, requestOptions);
    console.log('--------response');
    console.log(response);
    if (response.ok) {
        return returnType === 'json' ? await response.json() : await response.text();
    } else {
        error(`Error running ${functionName}, status:`, response.status);
        return null;
    }
}
