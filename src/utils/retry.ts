import Logger from './logger';

/**
 * Retry configuration options
 */
export interface RetryOptions {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Default retry options
 */
const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffMultiplier: 2,
    onRetry: (attempt: number, error: Error) => {
        Logger.warn(`Retry attempt ${attempt}`, { error: error.message });
    },
};

/**
 * Retry utility with exponential backoff
 */
export class RetryHandler {
    /**
     * Execute a function with retry logic
     * @param fn - The async function to execute
     * @param options - Retry configuration options
     * @returns The result of the function
     * @throws The last error if all retries fail
     */
    static async execute<T>(
        fn: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {
        const config = { ...DEFAULT_OPTIONS, ...options };
        let lastError: Error;
        let delay = config.initialDelay;

        for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
            try {
                // Try to execute the function
                const result = await fn();

                // Log success if this was a retry
                if (attempt > 1) {
                    Logger.info(`Operation succeeded on attempt ${attempt}`);
                }

                return result;
            } catch (error) {
                lastError = error as Error;

                // If this is the last attempt, throw the error
                if (attempt === config.maxAttempts) {
                    Logger.error(`All ${config.maxAttempts} retry attempts failed`, {
                        error: lastError.message,
                    });
                    throw lastError;
                }

                // Call the onRetry callback
                config.onRetry(attempt, lastError);

                // Wait before retrying (exponential backoff)
                await this.delay(delay);

                // Increase delay for next attempt (exponential backoff)
                delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
            }
        }

        // This should never be reached, but TypeScript requires it
        throw lastError!;
    }

    /**
     * Delay execution for a specified number of milliseconds
     * @param ms - Milliseconds to delay
     */
    private static delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Wrap a database query function with retry logic
     * @param queryFn - The database query function
     * @param queryName - Name of the query for logging
     * @returns Wrapped function with retry logic
     */
    static wrapDatabaseQuery<T>(
        queryFn: () => Promise<T>,
        queryName: string
    ): Promise<T> {
        return this.execute(queryFn, {
            maxAttempts: 3,
            initialDelay: 500,
            onRetry: (attempt, error) => {
                Logger.warn(`Retrying database query: ${queryName}`, {
                    attempt,
                    error: error.message,
                });
            },
        });
    }
}

export default RetryHandler;
