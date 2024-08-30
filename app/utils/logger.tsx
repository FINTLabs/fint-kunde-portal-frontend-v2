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

// ANSI escape codes for colors
const Colors = {
    Reset: '\x1b[0m',
    Red: '\x1b[31m',
};

export function log(...messages: any[]) {
    console.log(`[${getCurrentDateTime()}]`, ...messages);
}

export function error(...messages: any[]) {
    const formattedMessages = messages.map((message) =>
        message instanceof Error ? formatError(message) : message
    );
    // Log in red color
    console.error(`${Colors.Red}[${getCurrentDateTime()}]`, ...formattedMessages, Colors.Reset);
}

export function warn(...messages: any[]) {
    console.warn(`[${getCurrentDateTime()}]`, ...messages);
}
