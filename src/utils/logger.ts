import winston from 'winston';
import path from 'path';

/**
 * Logger utility using Winston
 * Provides structured logging with different levels and transports
 */

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define log colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

// Define which transports to use
const transports = [
    // Console transport
    new winston.transports.Console(),

    // File transport for errors
    new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
    }),

    // File transport for all logs
    new winston.transports.File({
        filename: path.join('logs', 'all.log'),
    }),
];

// Create the logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    levels,
    format,
    transports,
});

/**
 * Logger class with utility methods
 */
export class Logger {
    /**
     * Log error messages
     */
    static error(message: string, meta?: any): void {
        if (meta) {
            logger.error(`${message} ${JSON.stringify(meta)}`);
        } else {
            logger.error(message);
        }
    }

    /**
     * Log warning messages
     */
    static warn(message: string, meta?: any): void {
        if (meta) {
            logger.warn(`${message} ${JSON.stringify(meta)}`);
        } else {
            logger.warn(message);
        }
    }

    /**
     * Log info messages
     */
    static info(message: string, meta?: any): void {
        if (meta) {
            logger.info(`${message} ${JSON.stringify(meta)}`);
        } else {
            logger.info(message);
        }
    }

    /**
     * Log HTTP requests
     */
    static http(message: string, meta?: any): void {
        if (meta) {
            logger.http(`${message} ${JSON.stringify(meta)}`);
        } else {
            logger.http(message);
        }
    }

    /**
     * Log debug messages
     */
    static debug(message: string, meta?: any): void {
        if (meta) {
            logger.debug(`${message} ${JSON.stringify(meta)}`);
        } else {
            logger.debug(message);
        }
    }

    /**
     * Log API request
     */
    static logRequest(method: string, path: string, body?: any, ip?: string): void {
        const message = `API Request: ${method} ${path}`;
        const meta = {
            ip,
            body: body && Object.keys(body).length > 0 ? body : undefined,
        };
        this.http(message, meta);
    }

    /**
     * Log API response
     */
    static logResponse(method: string, path: string, statusCode: number, duration?: number): void {
        const message = `API Response: ${method} ${path} - Status: ${statusCode}`;
        const meta = duration ? { duration: `${duration}ms` } : undefined;
        this.http(message, meta);
    }

    /**
     * Log database operation
     */
    static logDatabaseOperation(operation: string, details?: any): void {
        const message = `Database Operation: ${operation}`;
        this.debug(message, details);
    }

    /**
     * Log error with stack trace
     */
    static logError(error: Error, context?: string): void {
        const message = context ? `Error in ${context}: ${error.message}` : `Error: ${error.message}`;
        const meta = {
            stack: error.stack,
            name: error.name,
        };
        this.error(message, meta);
    }
}

export default Logger;
