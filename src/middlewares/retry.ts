import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';
import { AxiosInstance } from 'axios';

export const configureRetry = (axiosInstance: AxiosInstance, retries: number = 3): void => {
    const retryConfig: IAxiosRetryConfig = {
        retries,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: (error) => {
            // Retry on network errors or 5xx status codes
            return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) >= 500;
        },
    };

    axiosRetry(axiosInstance, retryConfig);
};
