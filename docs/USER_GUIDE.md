# JSONPlaceholder SDK User Guide

Welcome to the comprehensive user guide for the JSONPlaceholder SDK. This document covers everything from initial setup to advanced configuration and troubleshooting.

## Table of Contents

1.  [Overview](#overview)
2.  [Installation](#installation)
3.  [Configuration](#configuration)
4.  [Core Features](#core-features)
5.  [Usage Guide](#usage-guide)
6.  [Troubleshooting](#troubleshooting)

---

## 1. Overview

This SDK provides a robust, type-safe TypeScript client for interacting with the JSONPlaceholder API. It is designed for production environments with built-in support for:

*   **Resilience**: Automatic retries for network failures and server errors.
*   **Performance**: Integrated Redis caching for read operations.
*   **Observability**: Structured logging via Pino.
*   **Developer Experience**: Full TypeScript definitions for all resources.

---

## 2. Installation

Ensure you have Node.js (v18+) installed.

```bash
npm install jsonplaceholder-sdk
```

---

## 3. Configuration

The client accepts an optional `SdkConfig` object during initialization.

```typescript
import { JsonPlaceholderClient } from 'jsonplaceholder-sdk';

const client = new JsonPlaceholderClient({
  // Base URL for the API (default: https://jsonplaceholder.typicode.com)
  baseUrl: 'https://api.example.com',

  // Request timeout in milliseconds (default: 10000)
  timeout: 5000,

  // Custom default headers
  headers: {
    'Authorization': 'Bearer my-token',
    'User-Agent': 'My-App/1.0'
  }
});
```

---

## 4. Core Features

### Automatic Retries
The SDK automatically retries failed requests (network errors, 5xx status codes) using exponential backoff.
*   **Default**: 3 retries.
*   **Mechanism**: Uses `axios-retry`.

### Caching (Redis)
To enable caching for GET requests, ensure a Redis instance is reachable.
*   **Config**: The SDK looks for a Redis server at `localhost:6379` by default.
*   **Environment Variable**: Set `REDIS_HOST` to override the hostname (e.g., `redis` in Docker).

### Logging
Structured logs are output to `stdout` in JSON format.
*   **Level**: Defaults to `info`. Set `LOG_LEVEL=debug` for verbose output.

---

## 5. Usage Guide

### Fetching Resources

```typescript
// List all posts
const allPosts = await client.posts.list();

// Get a single post by ID
const post = await client.posts.getById(1);
console.log(post.title);
```

### Creating Resources

```typescript
const newPost = await client.posts.create({
  title: 'My Awesome Post',
  body: 'This is the content of the post.',
  userId: 101
});
```

### Updating Resources

```typescript
const updatedPost = await client.posts.update(1, {
  title: 'Updated Title'
});
```

### Deleting Resources

```typescript
await client.posts.delete(1);
```

### Error Handling

The SDK throws typed `ApiError` objects.

```typescript
import { ApiError } from 'jsonplaceholder-sdk';

try {
  await client.posts.getById(99999);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
    // Access response data if available
    console.error('Details:', error.data);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## 6. Troubleshooting

### Redis Connection Errors
*   **Symptom**: Warnings about Redis connection failures in logs.
*   **Cause**: Redis is not running or not reachable at the default host.
*   **Fix**: Ensure Redis is running (`docker run -p 6379:6379 redis`) or ignore if caching is not required (the SDK degrades gracefully).

### Integration Tests Failing
*   **Symptom**: `npm test` hangs or fails.
*   **Fix**: Ensure no conflicting services are using port 6379. Use `scripts/clean.ts` to clear artifacts.

### Types Not Found
*   **Symptom**: TypeScript errors when importing.
*   **Fix**: Ensure your `tsconfig.json` has `moduleResolution: "node"` or "nodenext".
