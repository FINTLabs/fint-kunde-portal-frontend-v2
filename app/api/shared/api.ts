// import { IPartialAsset } from '~/types/Asset';
// import { IPartialAdapter } from '~/types/types';
import { HeaderProperties } from '~/utils/headerProperties';
import logger from '~/utils/logger';

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
        logger.debug(`Calling ${requestMethod} on ${functionName}: ${URL}`);

        const requestOptions: RequestInit = {
            method: requestMethod,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-nin': HeaderProperties.getXnin(),
                Cookie: HeaderProperties.getCookie(),
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
                    status: 500,
                    statusText: 'Beklager, noe gikk galt.',
                });
            // throw new Error(`Unsupported request method: ${requestMethod}`);
        }
    } catch (err) {
        if (err && typeof err === 'object' && 'status' in err && 'body' in err) {
            const errorStatus = err.status as number;
            const errorBody = err.body as string;
            logStatus(errorStatus, functionName, errorBody);

            // Re-throw the custom error with correct status and message
            throw new Response(errorBody, {
                status: errorStatus,
            });
        } else {
            logStatus(500, functionName, 'Internal Server Error');
            const errorMessage = `Internal Server Error (Error: Possible Couldn't connect to server: ${functionName})`;

            throw new Response(errorMessage, {
                status: 500,
                statusText: 'Beklager, noe gikk galt.',
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
    if (!response.ok) {
        throw new Error();
    }
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
        logger.debug(`POST request data: ${JSON.stringify(data)}`);
    }

    const response = await fetch(URL, requestOptions);

    if (response.ok) {
        logStatus(response.status, functionName);

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            logger.debug('POST request successful (JSON):', responseData);
            return responseData; // Return the parsed JSON data
        } else {
            logger.debug('POST request successful (non-JSON response)');
            return response.ok; // Return true for non-JSON responses
        }
    } else {
        const errorData = await response.json();
        const errorMessage = `Error ${errorData.status} (${errorData.error}): Får ikke tilgang ${errorData.path}`;

        throw {
            status: response.status,
            body: errorMessage,
        };
    }
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
