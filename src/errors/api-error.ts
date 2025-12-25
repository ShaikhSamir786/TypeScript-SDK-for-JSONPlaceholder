import { SdkError } from './sdk-error';

export class ApiError extends SdkError {
    public readonly statusCode: number;
    public readonly data: any;
    public readonly url?: string;

    constructor(message: string, statusCode: number, data?: any, url?: string) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.data = data;
        this.url = url;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
