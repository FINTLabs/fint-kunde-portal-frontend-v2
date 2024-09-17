type LogMessage = string | number | boolean | object | Error; // Add more types as needed

function getCurrentDateTime(): string {
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

const Colors = {
    Reset: '\x1b[0m',
    Red: '\x1b[31m',
    Green: '\x1b[32m',
    Yellow: '\x1b[33m',
    Blue: '\x1b[34m',
    Magenta: '\x1b[35m',
    Cyan: '\x1b[36m',
    White: '\x1b[37m',
    BrightRed: '\x1b[91m',
    BrightGreen: '\x1b[92m',
    BrightYellow: '\x1b[93m',
    BrightBlue: '\x1b[94m',
    BrightMagenta: '\x1b[95m',
    BrightCyan: '\x1b[96m',
    BrightWhite: '\x1b[97m',
};

export function log(...messages: LogMessage[]) {
    console.log(`[${getCurrentDateTime()}]`, ...messages);
}

export function error(...messages: LogMessage[]) {
    const formattedMessages = messages.map((message) =>
        message instanceof Error ? formatError(message) : message
    );
    // Log in red color
    console.error(
        `${Colors.BrightRed}[${getCurrentDateTime()}]`,
        ...formattedMessages,
        Colors.Reset
    );
}

export function warn(...messages: LogMessage[]) {
    console.warn(`${Colors.BrightYellow}[${getCurrentDateTime()}]`, ...messages, Colors.Reset);
}

export function info(...messages: LogMessage[]) {
    console.info(`${Colors.BrightGreen}[${getCurrentDateTime()}]`, ...messages, Colors.Reset);
}

export function debug(...messages: LogMessage[]) {
    console.debug(`${Colors.BrightMagenta}[${getCurrentDateTime()}]`, ...messages, Colors.Reset);
}
