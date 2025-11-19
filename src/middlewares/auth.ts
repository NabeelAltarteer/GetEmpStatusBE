import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends Error {
    public statusCode: number = 401;

    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

/**
 * JWT Payload interface
 */
interface JWTPayload {
    userId?: string;
    username?: string;
    role?: string;
}

/**
 * JWT Authentication utility
 */
export class JWTAuth {
    private static readonly SECRET_KEY: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    private static readonly EXPIRATION: string = process.env.JWT_EXPIRATION || '24h';

    /**
     * Generate JWT token
     * @param payload - Data to encode in the token
     * @returns JWT token string
     */
    static generateToken(payload: JWTPayload): string {
        try {
            // Use type assertion to bypass strict type checking
            const token = jwt.sign(
                payload as object,
                this.SECRET_KEY,
                { expiresIn: this.EXPIRATION } as any
            ) as string;

            Logger.info('JWT token generated', { username: payload.username });
            return token;
        } catch (error) {
            Logger.error('Error generating JWT token', { error: (error as Error).message });
            throw new Error('Failed to generate token');
        }
    }

    /**
     * Verify JWT token
     * @param token - JWT token to verify
     * @returns Decoded payload
     * @throws UnauthorizedError if token is invalid
     */
    static verifyToken(token: string): JWTPayload {
        try {
            const decoded = jwt.verify(token, this.SECRET_KEY) as JWTPayload;
            return decoded;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                Logger.warn('JWT token expired');
                throw new UnauthorizedError('Token expired');
            } else if (error.name === 'JsonWebTokenError') {
                Logger.warn('Invalid JWT token');
                throw new UnauthorizedError('Invalid token');
            }

            Logger.error('Error verifying JWT token', { error: (error as Error).message });
            throw new UnauthorizedError('Token verification failed');
        }
    }

    /**
     * Extract token from Authorization header
     * @param authHeader - Authorization header value
     * @returns Token string or null
     */
    static extractToken(authHeader: string | undefined): string | null {
        if (!authHeader) {
            return null;
        }

        // Support both "Bearer <token>" and "<token>" formats
        const parts = authHeader.split(' ');

        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1];
        } else if (parts.length === 1) {
            return parts[0];
        }

        return null;
    }
}

/**
 * Authentication middleware
 * Validates JWT token from Authorization header
 */
export const authenticateToken = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        // Extract token from header
        const token = JWTAuth.extractToken(req.headers.authorization);

        if (!token) {
            Logger.warn('Authentication failed: No token provided', {
                path: req.path,
                ip: req.ip,
            });
            throw new UnauthorizedError('No token provided');
        }

        // Verify token
        const decoded = JWTAuth.verifyToken(token);

        // Attach user info to request object
        (req as any).user = decoded;

        Logger.debug('Authentication successful', { username: decoded.username });
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error);
        } else {
            next(new UnauthorizedError('Authentication failed'));
        }
    }
};

/**
 * Optional authentication middleware
 * Validates token if present, but doesn't require it
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const token = JWTAuth.extractToken(req.headers.authorization);

        if (token) {
            const decoded = JWTAuth.verifyToken(token);
            (req as any).user = decoded;
            Logger.debug('Optional auth: Token validated', { username: decoded.username });
        } else {
            Logger.debug('Optional auth: No token provided');
        }

        next();
    } catch (error) {
        // For optional auth, we don't fail on invalid token
        Logger.warn('Optional auth: Invalid token provided');
        next();
    }
};

export default JWTAuth;
