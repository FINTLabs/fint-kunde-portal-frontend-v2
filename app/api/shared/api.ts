import { IPartialAsset } from '~/types/Asset';
import { IAdapter, IPartialAdapter } from '~/types/types';
import { isClientSide } from '~/utils/environment';
import { error, log } from '~/utils/logger';

export type ReturnType = 'text' | 'json';

export type IMiniAdapter = { name: string };
export type PostDataType = IPartialAdapter | IPartialAsset | IMiniAdapter;

export async function request(
    URL: string,
    functionName: string,
    requestMethod = 'GET',
    returnType: ReturnType = 'json',
    data?: PostDataType
) {
    try {
        log(`Running ${functionName} with URL:`, URL);

        let requestOptions: RequestInit = {
            method: requestMethod,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
            },
        };

        if (requestMethod === 'GET') {
            return await getRequest(URL, functionName, requestOptions, returnType);
        }
        if (requestMethod === 'POST') {
            return await postRequest(URL, functionName, requestOptions, data);
        }
        if (requestMethod === 'PUT') {
            return await putRequest(URL, functionName, requestOptions, data);
        }
        if (requestMethod === 'DELETE') {
            return await postRequest(URL, functionName, requestOptions, data);
        }
    } catch (err) {
        error(`Error running ${functionName}:`, err);
        throw new Error(`Error running ${functionName}`);
    }
}

export async function putRequest(
    URL: string,
    functionName: string,
    requestOptions: RequestInit,
    data?: PostDataType
) {
    if (data) {
        requestOptions = {
            ...requestOptions,
            body: JSON.stringify(data),
        };
    }

    return await fetch(URL, requestOptions);
}

export async function postRequest(
    URL: string,
    functionName: string,
    requestOptions: RequestInit,
    data?: PostDataType
) {
    if (data) {
        requestOptions = {
            ...requestOptions,
            body: JSON.stringify(data),
        };
    }

    log(`RequestOptions: `, requestOptions);

    const response = await fetch(URL, requestOptions);
    console.log(response);
    return response;
}

async function getRequest(
    URL: string,
    functionName: string,
    requestOptions: RequestInit,
    returnType: ReturnType
) {
    // log(`RequestOptions: `, requestOptions);
    const response = await fetch(URL, requestOptions);
    if (response.ok) {
        return returnType === 'json' ? await response.json() : await response.text();
    } else {
        error(`Error running ${functionName}, status:`, response.status);
        return null;
    }
}
