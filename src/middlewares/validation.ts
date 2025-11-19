import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors';

/**
 * Validate that request has JSON content type
 */
export const validateJsonContentType = (req: Request, _res: Response, next: NextFunction): void => {
    // Skip validation for GET requests
    if (req.method === 'GET') {
        next();
        return;
    }

    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('application/json')) {
        throw new BadRequestError('Content-Type must be application/json');
    }

    next();
};

/**
 * Validate that request body is not empty
 */
export const validateRequestBody = (req: Request, _res: Response, next: NextFunction): void => {
    // Skip validation for GET requests
    if (req.method === 'GET') {
        next();
        return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        throw new BadRequestError('Request body cannot be empty');
    }

    next();
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);

    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }

    next();
};
