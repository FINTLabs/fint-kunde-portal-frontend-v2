import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'error';

const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
