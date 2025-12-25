import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { logger } from '../core/logger';

export const requestLogger = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    logger.info({
        type: 'request',
        method: config.method?.toUpperCase(),
        url: config.baseURL ? `${config.baseURL}${config.url}` : config.url,
    }, 'Outgoing Request');
    return config;
};

export const responseLogger = (response: AxiosResponse): AxiosResponse => {
    logger.info({
        type: 'response',
        status: response.status,
        url: response.config.url,
    }, 'Incoming Response');
    return response;
};

export const errorLogger = (error: AxiosError): Promise<never> => {
    logger.error({
        type: 'error',
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        stack: error.stack,
    }, 'Request Failed');
    return Promise.reject(error);
};
