// utils/logger.ts

function getCurrentDateTime() {
    return new Date().toISOString();
}

function formatError(error: unknown): string {
    if (error instanceof Error) {
        return error.stack || error.message;
    } else if (typeof error === 'string') {
        return error;
    } else {
        try {
            return JSON.stringify(error);
        } catch {
            return 'An unknown error occurred';
        }
    }
}

export function log(...messages: any[]) {
    console.log(`[${getCurrentDateTime()}]`, ...messages);
}

export function error(...messages: any[]) {
    const formattedMessages = messages.map((message) =>
        message instanceof Error ? formatError(message) : message
    );
    console.error(`[${getCurrentDateTime()}]`, ...formattedMessages);
}

export function warn(...messages: any[]) {
    console.warn(`[${getCurrentDateTime()}]`, ...messages);
}
