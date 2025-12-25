/**
 * Delays execution for a specified number of milliseconds.
 * @param ms milliseconds to sleep
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Safely parses a JSON string.
 * @param text JSON string
 * @returns Parsed object or null if invalid
 */
export const safeJsonParse = <T = any>(text: string): T | null => {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};
