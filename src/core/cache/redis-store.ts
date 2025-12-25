import Redis from 'ioredis';

export class RedisStore {
    private redis: Redis;

    constructor(host: string = 'localhost', port: number = 6379) {
        this.redis = new Redis({
            host,
            port,
            lazyConnect: true, // Don't connect immediately to avoid blocking tests if redis unavailable
            retryStrategy: (times) => {
                if (times > 3) return null;
                return Math.min(times * 50, 2000);
            }
        });

        // Prevent unhandled error events when Redis is unavailable
        this.redis.on('error', () => {
            // Silently handle connection errors to avoid crashing apps/tests without Redis
        });
    }

    public async get(key: string): Promise<string | null> {
        try {
            return await this.redis.get(key);
        } catch (error) {
            console.warn('Redis get error:', error);
            return null;
        }
    }

    public async set(key: string, value: string, ttlSeconds: number = 300): Promise<void> {
        try {
            await this.redis.set(key, value, 'EX', ttlSeconds);
        } catch (error) {
            console.warn('Redis set error:', error);
        }
    }

    public async disconnect(): Promise<void> {
        await this.redis.quit();
    }

    // Expose raw instance if needed
    public get raw(): Redis {
        return this.redis;
    }
}
