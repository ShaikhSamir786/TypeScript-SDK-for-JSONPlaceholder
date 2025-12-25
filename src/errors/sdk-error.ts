export class SdkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SdkError';
        Object.setPrototypeOf(this, SdkError.prototype);
    }
}
