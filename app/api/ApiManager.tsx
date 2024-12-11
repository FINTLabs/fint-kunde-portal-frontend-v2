import logger from '~/utils/logger';
import { HeaderProperties } from '~/utils/headerProperties';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiCallOptions {
    method: HttpMethod;
    url: string;
    body?: string;
    contentType?: string;
    functionName?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning';
    data?: T;
}

export async function apiManager<T>({
    method,
    url,
    body,
    contentType = 'application/json',
    functionName,
}: ApiCallOptions): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
    const defaultHeaders: Record<string, string> = {
        'Content-Type': contentType,
        'x-nin': HeaderProperties.getXnin(),
    };

    const requestOptions: RequestInit = {
        method,
        headers: defaultHeaders,
    };

    if (body && method !== 'GET') {
        requestOptions.body = body;
    }

    logger.info(`API URL: ${url}`);

    try {
        const response = await fetch(url, requestOptions);
        logger.info(`API Response ${functionName}: ${response.status}`);

        if (!response.ok) {
            const errorMessage = await response.text();
            logger.error(`Request body: ${body}`);
            logger.error(`Response from ${functionName}: ${errorMessage}`);
            return {
                success: false,
                message: `Error: ${errorMessage} (Status: ${response.status})`,
                status: response.status,
            };
        }

        let data: T | undefined = undefined;
        if (response.ok && response.status !== 202) {
            try {
                const contentType = response.headers.get('Content-Type');
                if (contentType?.includes('application/json')) {
                    data = await response.json();
                } else if (contentType?.includes('text/plain')) {
                    const text = await response.text();
                    data = text as unknown as T;
                } else {
                    logger.warn(`Unexpected Content-Type: ${contentType}`);
                }
            } catch {
                logger.warn(
                    `No JSON/String returned for ${functionName}, status ${response.status}`
                );
            }
        }

        return {
            success: response.ok,
            data,
            message: response.statusText,
            status: response.status,
        };
    } catch (err: unknown) {
        logger.error('API response Error:', err);
        if (err instanceof Error) {
            return {
                success: false,
                message: `Det oppstod en uventet feil: ${err.message}`,
                status: 500,
            };
        } else {
            logger.error('API response Error: An unknown error occurred');
            return {
                success: false,
                message: 'Det oppstod en uventet feil: Uventet feiltype',
                status: 500,
            };
        }
    }
}

export function handleApiResponse<T>(
    apiResults: { success: boolean; data?: T; message?: string; status?: number },
    errorMessage: string,
    successMessage: string = '',
    successVariant: 'success' | 'warning' = 'success'
): ApiResponse<T> {
    if (!apiResults.success) {
        throw new Response(apiResults.message, {
            status: apiResults.status,
            statusText: errorMessage,
        });
    }

    return {
        success: true,
        message: successMessage,
        variant: successVariant,
        data: apiResults.data,
    };
}
