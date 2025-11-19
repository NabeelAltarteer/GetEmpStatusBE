import { createClient, RedisClientType } from 'redis';
import Logger from './logger';

/**
 * CacheHandler - Redis-based caching utility
 * Provides caching functionality with TTL support
 */
export class CacheHandler {
    private client: RedisClientType | null = null;
    private isConnected: boolean = false;
    private readonly defaultTTL: number = 3600; // 1 hour in seconds

    /**
     * Initialize Redis connection
     */
    async connect(): Promise<void> {
        try {
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

            this.client = createClient({
                url: redisUrl,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 3) {
                            Logger.warn('Redis connection failed after 3 retries, giving up.');
                            return false; // Stop retrying
                        }
                        return Math.min(retries * 100, 1000); // Wait up to 1s
                    }
                }
            });

            this.client.on('error', (err) => {
                // Only log if we are still trying to connect or if it's a new error
                if (this.isConnected) {
                    Logger.error('Redis Client Error', { error: err.message || err });
                    this.isConnected = false;
                } else {
                    // Suppress repeated errors during reconnection attempts unless debugging
                    Logger.debug('Redis Client Error (during connection)', { error: err.message || err });
                }
            });

            this.client.on('connect', () => {
                Logger.info('Redis Client Connected');
                this.isConnected = true;
            });

            this.client.on('disconnect', () => {
                Logger.warn('Redis Client Disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
            Logger.info('Cache Handler initialized successfully');
        } catch (error) {
            Logger.warn('Failed to connect to Redis - running without cache', { error: (error as Error).message });
            this.isConnected = false;
            // Don't throw - allow app to run without cache
        }
    }

    /**
     * Disconnect from Redis
     */
    async disconnect(): Promise<void> {
        if (this.client && this.isConnected) {
            await this.client.quit();
            Logger.info('Cache Handler disconnected');
        }
    }

    /**
     * Get value from cache
     * @param key - Cache key
     * @returns Cached value or null if not found
     */
    async get<T>(key: string): Promise<T | null> {
        if (!this.isConnected || !this.client) {
            Logger.debug('Cache not available, skipping get');
            return null;
        }

        try {
            const value = await this.client.get(key);

            if (value) {
                Logger.debug(`Cache HIT: ${key}`);
                return JSON.parse(value) as T;
            }

            Logger.debug(`Cache MISS: ${key}`);
            return null;
        } catch (error) {
            Logger.error('Cache get error', { key, error: (error as Error).message });
            return null;
        }
    }

    /**
     * Set value in cache
     * @param key - Cache key
     * @param value - Value to cache
     * @param ttl - Time to live in seconds (default: 1 hour)
     */
    async set(key: string, value: any, ttl?: number): Promise<void> {
        if (!this.isConnected || !this.client) {
            Logger.debug('Cache not available, skipping set');
            return;
        }

        try {
            const serialized = JSON.stringify(value);
            const expirationTime = ttl || this.defaultTTL;

            await this.client.setEx(key, expirationTime, serialized);
            Logger.debug(`Cache SET: ${key} (TTL: ${expirationTime}s)`);
        } catch (error) {
            Logger.error('Cache set error', { key, error: (error as Error).message });
        }
    }

    /**
     * Delete value from cache
     * @param key - Cache key
     */
    async delete(key: string): Promise<void> {
        if (!this.isConnected || !this.client) {
            Logger.debug('Cache not available, skipping delete');
            return;
        }

        try {
            await this.client.del(key);
            Logger.debug(`Cache DELETE: ${key}`);
        } catch (error) {
            Logger.error('Cache delete error', { key, error: (error as Error).message });
        }
    }

    /**
     * Delete all keys matching a pattern
     * @param pattern - Key pattern (e.g., "employee:*")
     */
    async deletePattern(pattern: string): Promise<void> {
        if (!this.isConnected || !this.client) {
            Logger.debug('Cache not available, skipping delete pattern');
            return;
        }

        try {
            const keys = await this.client.keys(pattern);

            if (keys.length > 0) {
                await this.client.del(keys);
                Logger.debug(`Cache DELETE PATTERN: ${pattern} (${keys.length} keys)`);
            }
        } catch (error) {
            Logger.error('Cache delete pattern error', { pattern, error: (error as Error).message });
        }
    }

    /**
     * Clear all cache
     */
    async clear(): Promise<void> {
        if (!this.isConnected || !this.client) {
            Logger.debug('Cache not available, skipping clear');
            return;
        }

        try {
            await this.client.flushDb();
            Logger.info('Cache cleared');
        } catch (error) {
            Logger.error('Cache clear error', { error: (error as Error).message });
        }
    }

    /**
     * Check if cache is available
     */
    isAvailable(): boolean {
        return this.isConnected;
    }

    /**
     * Generate cache key for employee data
     * @param nationalNumber - Employee's national number
     */
    static getEmployeeKey(nationalNumber: string): string {
        return `employee:${nationalNumber}`;
    }
}

// Export singleton instance
export default new CacheHandler();
