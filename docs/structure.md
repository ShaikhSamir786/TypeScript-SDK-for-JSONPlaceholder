jsonplaceholder-sdk/
├── src/
│   ├── core/                       # SDK infrastructure (engine)
│   │   ├── http/
│   │   │   ├── http-client.ts      # Axios/fetch wrapper
│   │   │   ├── request.ts          # Request builder
│   │   │   └── response.ts         # Response handling
│   │   │
│   │   ├── config.ts               # SDK configuration
│   │   ├── base-client.ts          # Base SDK client
│   │   ├── serializer.ts           # JSON ↔ TS mapping
│   │   └── utils.ts                # Shared helpers
│   │
│   ├── resources/                  # API domains
│   │   ├── posts/
│   │   │   ├── posts.client.ts     # posts API methods
│   │   │   ├── posts.types.ts      # Post interfaces
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                # Export all resources
│   │
│   ├── errors/
│   │   ├── sdk-error.ts            # Base SDK error
│   │   ├── api-error.ts            # HTTP errors
│   │   └── validation-error.ts     # Input validation
│   │
│   ├── middlewares/                # Request lifecycle hooks
│   │   ├── logger.ts
│   │   ├── retry.ts
│   │   └── timeout.ts
│   │
│   ├── index.ts                    # Public exports
│   └── jsonplaceholder-client.ts   # Main SDK class
│
├── tests/
│   ├── unit/
│   │   └── posts.test.ts
│   │
│   ├── integration/
│   │   └── posts.integration.test.ts
│   │
│   └── setup.ts
│
├── examples/
│   ├── basic.ts
│   └── advanced.ts
│
├── docs/
│   ├── architecture.md
│   └── api.md
│
├── scripts/
│   ├── build.ts
│   └── release.ts
│
├── dist/                           # Compiled output (ignored in git)
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI pipeline
│
├── .eslint.json
├── .prettierrc
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── README.md
└── LICENSE
