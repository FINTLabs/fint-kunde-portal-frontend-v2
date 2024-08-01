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
    data?: PostDataType,
) {
    try {
        log(`Running ${functionName} with URL:`, URL);

        let requestOptions: RequestInit = {
            method: requestMethod,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': process.env.PERSONALNUMBER || '',
                // Cookie: cookies, // Include cookies in the request headers
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // TODO: this is just a temporary solution, change this to fetch accesstoken from OAuth 2.0 log in
            },
        };

        switch (requestMethod) {
            case 'GET':
                return await getRequest(URL, functionName, requestOptions, returnType);
            case 'POST':
                return await postRequest(URL, functionName, requestOptions, data);
            case 'PUT':
                return await putRequest(URL, functionName, requestOptions, data);
            case 'DELETE':
                return await postRequest(URL, functionName, requestOptions, data);
            default:
                throw new Error(`Unsupported request method: ${requestMethod}`);
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
    log(`RequestOptions: `, requestOptions);
    const response = await fetch(URL, requestOptions);
    log(`Response: `, response);
    if (response.ok) {
        return returnType === 'json' ? await response.json() : await response.text();
    } else {
        error(`Error running ${functionName}, status:`, response.status);
        return null;
    }
}
