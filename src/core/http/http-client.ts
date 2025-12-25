import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { SdkConfig } from '../config';
import { ApiError } from '../../errors/api-error';
import { requestLogger, responseLogger, errorLogger } from '../../middlewares/logger';
import { configureRetry } from '../../middlewares/retry';
import { cacheRequestInterceptor, cacheResponseInterceptor } from '../../middlewares/cache';

export class HttpClient {
    private axiosInstance: AxiosInstance;

    constructor(config: SdkConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseUrl || 'https://jsonplaceholder.typicode.com',
            timeout: config.timeout || 10000,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        });

        // Configure middlewares
        configureRetry(this.axiosInstance);

        // Add logging interceptors
        this.axiosInstance.interceptors.request.use(requestLogger);
        this.axiosInstance.interceptors.response.use(responseLogger, errorLogger);

        // Add Cache interceptors (after logger to log actual network requests, but depends on preference)
        // Actually, if we want to log CACHE HITs, we might want cache before logger? 
        // But usually logger is outer shell.
        this.axiosInstance.interceptors.request.use(cacheRequestInterceptor);
        this.axiosInstance.interceptors.response.use(cacheResponseInterceptor);

        this.initializeErrorInterceptor();
    }

    private initializeErrorInterceptor() {
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    throw new ApiError(
                        `Request failed with status ${error.response.status}`,
                        error.response.status,
                        error.response.data,
                        error.config?.url
                    );
                }
                throw error;
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    // Expose the raw axios instance if needed for advanced usage
    public get raw(): AxiosInstance {
        return this.axiosInstance;
    }
}
