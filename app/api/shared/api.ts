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
        logger.verbose(`Calling ${requestMethod} on ${functionName}: ${URL}`);

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

            throw new Response(errorBody, {
                status: errorStatus,
            });
        } else {
            logStatus(500, functionName, 'Internal Server Error');
            const errorMessage = `Internal Server Error - ${functionName} failed`;

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
        const jsonData = JSON.stringify(data);
        logger.debug(`PUT request body: ${jsonData}`);
        requestOptions = {
            ...requestOptions,
            body: JSON.stringify(data),
        };
    }

    const response = await fetch(URL, requestOptions);
    logStatus(response.status, functionName);

    if (!response.ok) {
        throw new Error();
    }

    return response;
}

export async function postRequest<T = unknown>(
    URL: string,
    functionName: string,
    requestOptions: RequestInit,
    data?: T
) {
    if (data) {
        const jsonData = JSON.stringify(data);
        logger.debug(`POST request body: ${jsonData}`);
        requestOptions = {
            ...requestOptions,
            body: JSON.stringify(data),
        };
    }

    const response = await fetch(URL, requestOptions);
    logStatus(response.status, functionName);

    if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            logger.debug('POST request successful (JSON):', responseData);
            return responseData;
        } else {
            logger.debug('POST request successful (non-JSON response)');
            return response;
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
        const responseData = returnType === 'json' ? await response.json() : await response.text();
        logger.silly(`Data returned from ${functionName}: ${JSON.stringify(responseData)}`);
        return responseData;
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
            logger.error(`Error Message: ${errorMessage}`);
        }
    }
}
