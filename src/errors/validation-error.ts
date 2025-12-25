import { SdkError } from './sdk-error';

export class ValidationError extends SdkError {
    public readonly errors: Record<string, string[]>;

    constructor(message: string, errors: Record<string, string[]> = {}) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
