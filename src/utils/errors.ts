/**
 * Custom Error Classes for API Error Handling
 */

/**
 * Base API Error class
 */
export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 - Not Found Error
 * Used when a resource (like user with national number) is not found
 */
export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * 406 - Not Acceptable Error
 * Used when user is inactive
 */
export class NotAcceptableError extends ApiError {
    constructor(message = 'User is not active') {
        super(message, 406);
    }
}

/**
 * 422 - Unprocessable Entity Error
 * Used when there is insufficient data (less than 3 salary records)
 */
export class UnprocessableEntityError extends ApiError {
    constructor(message = 'Insufficient data to process request') {
        super(message, 422);
    }
}

/**
 * 400 - Bad Request Error
 * Used for validation errors
 */
export class BadRequestError extends ApiError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

/**
 * 401 - Unauthorized Error
 * Used for authentication failures
 */
export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 500 - Internal Server Error
 * Used for unexpected errors
 */
export class InternalServerError extends ApiError {
    constructor(message = 'Internal server error') {
        super(message, 500, false);
    }
}
