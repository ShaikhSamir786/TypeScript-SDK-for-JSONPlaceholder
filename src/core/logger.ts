import pino from 'pino';

// Create a centralized pino instance
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    // In a real app, you might configure transport targets here (e.g., file, remote)
    // For now, it logs to stdout/stderr in JSON format (pino default).
    // For implementation contexts (SDK), standardizing on JSON is best for machine parsing.
});
