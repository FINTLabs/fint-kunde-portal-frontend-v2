// import { IPartialAsset } from '~/types/Asset';
// import { IPartialAdapter } from '~/types/types';
import { Utility } from '~/utils/utility';

export type ReturnType = 'text' | 'json';

export type IMiniAdapter = { name: string };
// export type PostDataType = IPartialAdapter | IPartialAsset | IMiniAdapter;

export async function request<T = unknown>(
    URL: string,
    functionName: string,
    requestMethod = 'GET',
    returnType: ReturnType = 'json',
    data?: T
) {
    try {
        console.debug(`> Calling ${requestMethod} on ${functionName}:`, URL);

        const requestOptions: RequestInit = {
            method: requestMethod,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': Utility.getXnin(),
            },
        };

        switch (requestMethod) {
            case 'GET':
                return await getRequest(URL, functionName, requestOptions, returnType);
            case 'POST':
                if (data) {
                    return await postRequest(URL, functionName, requestOptions, data);
                }
                break;
            case 'PUT':
                return await putRequest(URL, functionName, requestOptions, data);
            case 'DELETE':
                return await postRequest(URL, functionName, requestOptions, data);
            default:
                return new Error(`Unsupported request method: ${requestMethod}`);
        }
    } catch (err) {
        if (err instanceof Error) {
            logStatus(500, functionName, err.message);
        } else {
            logStatus(500, functionName, String(err));
        }
        throw new Response(`Request failed: Error running ${functionName}`, {
            status: 500,
        });
    }
}

export async function putRequest<T = unknown>(
    URL: string,
    functionName: string,
    requestOptions: RequestInit,
    data?: T
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

export async function postRequest<T = unknown>(
    URL: string,
    functionName: string,
    requestOptions: RequestInit,
    data?: T
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
    const response = await fetch(URL, requestOptions);
    logStatus(response.status, functionName);

    if (response.ok) {
        return returnType === 'json' ? await response.json() : await response.text();
    } else {
        logStatus(response.status, functionName);
        throw new Response(`Request failed: Error running ${functionName}`, {
            status: 500,
        });
    }
}

function logStatus(status: number, functionName: string, errorMessage?: string) {
    if (status >= 200 && status < 300) {
        console.debug(`🟢--> Result: ${functionName} ${status}`);
    } else {
        console.error(`🔴--> Result: ${functionName} ${status}`);
        if (errorMessage) {
            console.debug(errorMessage);
        }
    }
}
