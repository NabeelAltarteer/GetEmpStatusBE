import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import Logger from '../utils/logger';

/**
 * Error response interface
 */
interface ErrorResponse {
    status: 'error';
    message: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    stack?: string;
}

/**
 * Global error handling middleware
 * Catches all errors and formats them into consistent API responses
 */
export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal server error';
    let isOperational = false;

    // Check if it's our custom ApiError
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    } else if (err instanceof Error) {
        message = err.message;
    }

    // Build error response
    const errorResponse: ErrorResponse = {
        status: 'error',
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        path: req.path
    };

    // Include stack trace in development mode
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    // Log error for monitoring
    if (!isOperational) {
        Logger.logError(err as Error, `${req.method} ${req.path}`);
    } else {
        Logger.warn(`Operational Error [${statusCode}]: ${message}`, {
            path: req.path,
            method: req.method
        });
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.path} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString()
    });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
