export interface SdkConfig {
    /**
     * The base URL for the API.
     * @default 'https://jsonplaceholder.typicode.com'
     */
    baseUrl?: string;

    /**
     * Request timeout in milliseconds.
     * @default 10000
     */
    timeout?: number;

    /**
     * Default headers to include in every request.
     */
    headers?: Record<string, string>;
}
