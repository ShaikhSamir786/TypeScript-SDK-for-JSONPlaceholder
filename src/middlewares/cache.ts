import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { RedisStore } from '../core/cache/redis-store';

// Initialize store (in a real app, this might be injected or configured via environment)
// Default to 'redis' hostname for Docker, or 'localhost' for local
const redisHost = process.env.REDIS_HOST || 'localhost';
const store = new RedisStore(redisHost);

export const cacheRequestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    if (config.method?.toLowerCase() === 'get' && config.url) {
        const key = `cache:${config.url}`;
        const cachedResponse = await store.get(key);

        if (cachedResponse) {
            // Create a fake adapter that returns the cached data
            config.adapter = () => {
                return Promise.resolve({
                    data: JSON.parse(cachedResponse),
                    status: 200,
                    statusText: 'OK',
                    headers: { 'x-cache': 'HIT' },
                    config,
                    request: {},
                } as AxiosResponse);
            };
        }
    }
    return config;
};

export const cacheResponseInterceptor = async (response: AxiosResponse): Promise<AxiosResponse> => {
    if (response.config.method?.toLowerCase() === 'get' && response.config.url) {
        // Only cache if it wasn't a hit (x-cache header missing or MISS)
        // Actually, if we hit the cache adapter, this interceptor might run on the *cached* response too?
        // Axios interceptors run on response. If adapted, it still flows through.
        // Check if it's a fresh response
        if (!response.headers['x-cache']) {
            const key = `cache:${response.config.url}`;
            await store.set(key, JSON.stringify(response.data));
        }
    }
    return response;
};
