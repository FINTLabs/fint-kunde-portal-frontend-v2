// import { IPartialAsset } from '~/types/Asset';
// import { IPartialAdapter } from '~/types/types';
import { Utility } from '~/utils/utility';
import logger from '~/utils/logger'; // Import your Winston logger

export type ReturnType = 'text' | 'json';

export type IMiniAdapter = { name: string };
// export type PostDataType = IPartialAdapter | IPartialAsset | IMiniAdapter;

function isErrorWithStatusAndBody(err: unknown): err is { status: number; body: string } {
    return (
        typeof err === 'object' && err !== null && 'status' in err && 'body' in err && true && true
    );
}

export async function request<T = unknown>(
    URL: string,
    functionName: string,
    requestMethod = 'GET',
    returnType: ReturnType = 'json',
    data?: T,
    cookies: string = ""
) {
    try {
        logger.debug(`Calling ${requestMethod} on ${functionName}: ${URL}`);

        const requestOptions: RequestInit = {
            method: requestMethod,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': Utility.getXnin(),
                'Cookie': cookies
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
                throw new Response(`Unsupported request method: ${requestMethod}`, {
                    status: 404,
                    statusText: 'Something went wrong!',
                });
            // throw new Error(`Unsupported request method: ${requestMethod}`);
        }
    } catch (err) {
        if (isErrorWithStatusAndBody(err)) {
            const errorStatus = err.status;
            const errorBody = err.body;
            logStatus(errorStatus, functionName, errorBody);
            throw new Response(`${errorBody}`, {
                status: errorStatus,
            });
        } else {
            logStatus(500, functionName, 'Internal Server Error');
            throw new Response("500 Internal Server Error ( Error: Couldn't connect to server)", {
                status: 500,
                statusText: 'Something went wrong!',
            });
        }
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
        const errorData = await response.json();
        const errorMessage = `Error ${errorData.status} (${errorData.error}): Får ikke tilgang ${errorData.path}`;

        throw {
            status: response.status,
            body: `${errorMessage}`,
        };
    }
}

function logStatus(status: number, functionName: string, errorMessage?: string) {
    if (status >= 200 && status < 300) {
        logger.info(`🟢--> Result: ${functionName} ${status}`);
    } else {
        logger.error(`🔴--> Result: ${functionName} ${status}`);
        if (errorMessage) {
            logger.debug(`Error Message: ${errorMessage}`);
        }
    }
}
