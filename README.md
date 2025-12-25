# JSONPlaceholder SDK

A robust, type-safe Node.js SDK for the JSONPlaceholder API.

[![CI](https://github.com/myuser/json-placeholder-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/myuser/json-placeholder-sdk/actions/workflows/ci.yml)

> 📘 **Documentation**: For a detailed integration guide, configuration options, and troubleshooting, see the [User Guide](docs/USER_GUIDE.md).

## Features

- **Full TypeScript Support**: Typed interfaces for all resources (Posts, etc.).
- **Resilient**: Automatic retries using exponential backoff.
- **Performant**: Built-in Redis caching support.
- **Observable**: Structured JSON logging via Pino.
- **Configurable**: Customize timeouts, headers, and base URLs.

## Installation

```bash
npm install jsonplaceholder-sdk
```

## Quick Start

```typescript
import { JsonPlaceholderClient } from 'jsonplaceholder-client';

const client = new JsonPlaceholderClient({
  // Configuration options
  timeout: 5000,
});

async function main() {
  try {
    // List posts
    const posts = await client.posts.list();
    console.log(`Found ${posts.length} posts`);

    // Create a post
    const newPost = await client.posts.create({
        title: 'My New Post',
        body: 'Content goes here',
        userId: 1
    });
    console.log('Created:', newPost);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
```

## Advanced Configuration

### Caching (Redis)

To enable caching, ensure a Redis instance is available and set the `REDIS_HOST` environment variable, or the SDK will attempt to connect to `localhost`.

### Logging

The SDK uses `pino` for structured logging. By default, it logs to `stdout`.

## License

MIT
