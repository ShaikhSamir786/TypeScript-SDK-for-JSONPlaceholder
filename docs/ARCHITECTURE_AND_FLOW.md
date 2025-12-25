# Architecture & Data Flow Analysis

This document provides a deep dive into the inner workings of the `jsonplaceholder-sdk`. It explains the structural design, data flow through the system, and the specific responsibilities of each component.

## 1. System Overview

The SDK serves as a robust, production-grade Facade between a Node.js application and the JSONPlaceholder REST API. It abstracts away the complexities of HTTP communication, error handling, resiliency patterns, and caching, exposing a clean, type-safe interface to the developer.

### High-Level Architecture

```mermaid
graph TD
    UserApp[User Application] --> SDK_Entry[JsonPlaceholderClient]
    
    subgraph "SDK Internals"
        SDK_Entry --> Resource_Layer[Resource Clients<br>(PostsClient)]
        Resource_Layer --> Core_HTTP[Core HTTP Client<br>(Axios Wrapper)]
        
        subgraph "Middleware Pipeline"
            Core_HTTP --> Cache_Interceptor[Redis Cache Middleware]
            Core_HTTP --> Logger_Interceptor[Pino Logger]
            Core_HTTP --> Retry_Logic[Exponential Backoff]
        end
    end
    
    Core_HTTP -- Network Request --> External_API[JSONPlaceholder API]
    External_API -- JSON Response --> Core_HTTP
    
    subgraph "Infrastructure"
        Redis[(Redis Cache)] -.-> Cache_Interceptor
    end
```

---

## 2. Component Roles & Responsibilities

### A. The Entry Point: `JsonPlaceholderClient`
*   **Location**: `src/jsonplaceholder-client.ts`
*   **Role**: The main interface for consumers.
*   **Responsibility**: 
    1.  Accepts configuration (`SdkConfig`) for base URL, timeouts, and headers.
    2.  Initializes the `HttpClient` singleton.
    3.  Instantiates and exposes resource clients (e.g., `.posts`).

### B. The Resource Layer: `src/resources/`
*   **Example**: `PostsClient` (`src/resources/posts/posts.client.ts`)
*   **Role**: Domain-specific logic.
*   **Responsibility**:
    1.  Translates high-level method calls (e.g., `list()`, `create()`) into specific HTTP methods and endpoints (`GET /posts`).
    2.  Defines strict TypeScript interfaces for inputs and outputs (`Post`, `CreatePostRequest`).
    3.  Delivers the payload to the Core HTTP Layer.

### C. The Core HTTP Layer: `HttpClient`
*   **Location**: `src/core/http/http-client.ts`
*   **Role**: The engine room.
*   **Responsibility**:
    1.  Wraps the `axios` library to provide a consistent internal API.
    2.  Manages the lifecycle of standard HTTP headers and timeouts.
    3.  **Critical**: Registers and manages the Middleware Pipeline (interceptors).
    4.  Normalizes errors into `ApiError` objects.

### D. The Middleware System
Located in `src/middlewares/`, these interceptors wrap the HTTP request lifecycle.

1.  **Caching (`cache.ts`)**:
    *   *Request*: Checks Redis for a matching key before sending a network request. If found, returns immediately (Short-circuit).
    *   *Response*: Saves successful GET responses to Redis with a TTL.
2.  **Logging (`logger.ts`)**:
    *   Uses `pino` to emit structured JSON logs.
    *   Logs outgoing request details (Method, URL) and incoming response status/duration.
3.  **Retry (`retry.ts`)**:
    *   Uses `axios-retry` to intercept failed requests (Network errors, 5xx).
    *   Re-queues the request with exponential backoff.

### E. Infrastructure Services
*   **Redis**: Stores cached API responses to reduce latency.
*   **Nginx**: Acts as a reverse proxy/load balancer in the Docker composition to manage traffic ingress.

---

## 3. Data Flow Walkthrough

Let's trace the journey of a single call: `await client.posts.getById(1)`

### Step 1: Initialization
User creates `new JsonPlaceholderClient({ timeout: 5000 })`. The SDK sets up the Axios instance and connects to Redis.

### Step 2: Resource Call
The user calls `posts.getById(1)`. The `PostsClient` constructs the path `/posts/1` and delegates to `httpClient.get('/posts/1')`.

### Step 3: Middleware Pipeline (Request Phase)
The request enters the Axios interceptor chain:
1.  **Cache Interceptor**: Computes key `cache:/posts/1`. Queries Redis.
    *   *Scenario A (Hit)*: JSON data found. Request is cancelled, cached data returned immediately. **(End of Flow)**
    *   *Scenario B (Miss)*: No data. Request proceeds.
2.  **Logger Interceptor**: Logs `INFO: Outgoing Request GET /posts/1`.

### Step 4: Network Transmission
The HTTP request leaves the Node.js process.
*   If network fails: **Retry Middleware** catches the error, waits (backoff), and retries Step 4.

### Step 5: External Processing
The JSONPlaceholder API processes the request and returns `200 OK` with JSON body.

### Step 6: Middleware Pipeline (Response Phase)
The response enters the interceptor chain:
1.  **Logger Interceptor**: Logs `INFO: Incoming Response 200 /posts/1`.
2.  **Cache Interceptor**: Sees a fresh GET response. Serializes the JSON body and saves it to Redis with a 5-minute TTL.

### Step 7: Delivery
The `HttpClient` returns the raw data. The `PostsClient` casts it to the `Post` type. The User receives the strictly typed `Post` object.
