import { IPartialAsset } from '~/types/Asset';
import { IPartialAdapter } from '~/types/types';
import { error, info, log } from '~/utils/logger';
import { Utility } from '~/utils/utility';

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
        log(`> Calling ${requestMethod} on ${functionName}:`, URL);

        const requestOptions: RequestInit = {
            method: requestMethod,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': Utility.getXnin(), //  process.env.PERSONALNUMBER || '', // TODO: get x-nin from headers
                // Cookie: cookies ?? '', // Include cookies in the request headers
                // Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // TODO: this is just a temporary solution, change this to fetch accesstoken from OAuth 2.0 log in
            },
        };

        // log('requestOptions in request');
        // log(requestOptions);

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
                return new Error(`Unsupported request method: ${requestMethod}`);
        }
    } catch (err) {
        if (err instanceof Error) {
            error(`:( Request failed: Error running ${functionName}:`, err);
        } else {
            error(`:( Request failed: Error running ${functionName}:`, String(err));
        }
        // Rethrow as a new Error with a descriptive message
        throw new Error(`:( Request failed: Error running ${functionName}`);
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

    const response = await fetch(URL, requestOptions);
    logStatus(response.status, functionName);
    return response;
}

function logStatus(status: number, functionName: string) {
    if (status >= 200 && status < 300) {
        info(` 🟢--> Result: ${functionName} ${status}`);
    } else {
        error(`🔴--> Result: ${functionName} ${status} `);
    }
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

    const response = await fetch(URL, requestOptions);
    logStatus(response.status, functionName);
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
    logStatus(response.status, functionName);

    if (response.ok) {
        return returnType === 'json' ? await response.json() : await response.text();
    } else {
        // log(`Response: `, response);
        const errorMsg = `😡 Error running ${functionName}, status: ${response.status}`;
        error(errorMsg);
        // return errorMsg;
        throw error;
    }
}
