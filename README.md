# JSONPlaceholder SDK

A production-grade TypeScrip SDK for the JSONPlaceholder API.

## Features

- **Typed Resources**: Full TypeScript support for API resources (Posts, etc.).
- **Robust Error Handling**: Custom error classes for API, Validation, and SDK errors.
- **Middleware Support**: Built-in request logging and automatic retries.
- **Configurable**: Easy configuration for base URL, timeouts, and headers.

## Installation

```bash
npm install jsonplaceholder-sdk
```

## Usage

```typescript
import { JsonPlaceholderClient } from 'jsonplaceholder-sdk';

const client = new JsonPlaceholderClient({
  timeout: 5000,
  // headers: { 'Authorization': '...' }
});

async function main() {
  const posts = await client.posts.list();
  console.log(posts);
}

main();
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run example
npx ts-node examples/basic.ts
```

## License

MIT
