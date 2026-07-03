# FluxRoute

FluxRoute is a Solana-native routing layer for AI agents that need to call paid
HTTP microservices through one MCP-facing integration. The API negotiates
x402-style payment requirements, verifies SOL or USDC-SPL payments on-chain,
proxies verified requests to provider services, and records spend/earnings
ledgers.

Production domains:

- Landing: `https://fluxroute.xyz`
- Dashboard: `https://dashboard.fluxroute.xyz`
- API: `https://api.fluxroute.xyz`
- Repository: `https://github.com/FluxRouteOfficial/FluxRoute`

## Monorepo Layout

```text
apps/api              Fastify REST API for auth, registry, payments, wallet data
apps/dashboard        Next.js dashboard shell for consumers and providers
apps/mcp-server       MCP stdio server for agent integrations
packages/database     Drizzle schema, migration runner, seed script
packages/shared       Shared Zod schemas, constants, fee math, types
packages/provider-sdk Provider-side x402 helpers and middleware
fluxroute-landing     Standalone Next.js marketing and docs site
tests                 Vitest coverage for shared logic, SDK, migrations
```

## Current Production Status

The landing, dashboard, and API are live on the production domains above. The
API runs on Railway with Postgres, Redis, RS256 JWT keys, Helius Solana RPC,
database migrations, and restricted CORS configured.

Do not treat Vercel preview URLs as canonical. Public links, SEO metadata, docs,
and dashboard configuration should use the production domains above.

## Requirements

- Node.js 20+ and npm 10+
- PostgreSQL 15+
- Redis 7+
- Solana RPC endpoint for production transaction verification
- RS256 JWT key pair supplied through environment variables or runtime files

## Local Setup

```bash
npm install
cd fluxroute-landing && npm install && cd ..
cp .env.example .env.local
```

Generate local JWT keys outside source control:

```bash
mkdir -p apps/api/keys
openssl genrsa -out apps/api/keys/private.pem 2048
openssl rsa -in apps/api/keys/private.pem -pubout -out apps/api/keys/public.pem
```

Start dependencies and prepare the database:

```bash
docker compose up -d postgres redis
npm run build:packages
npm run migrate
npm run seed
```

Run services:

```bash
npm run dev:api
npm run dev:dashboard
npm run dev:mcp
cd fluxroute-landing && npm run dev
```

## Required Environment

See `.env.example` for the full list. Production must set:

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY`, or `JWT_PRIVATE_KEY_PATH` and `JWT_PUBLIC_KEY_PATH`
- `JWT_ISSUER=fluxroute.xyz`
- `SOLANA_RPC_URL`
- `USDC_MINT`
- `CORS_ORIGIN=https://fluxroute.xyz,https://www.fluxroute.xyz,https://dashboard.fluxroute.xyz`
- `NEXT_PUBLIC_API_URL=https://api.fluxroute.xyz`
- `NEXT_PUBLIC_SITE_URL=https://fluxroute.xyz`
- `NEXT_PUBLIC_MARKETING_URL=https://fluxroute.xyz`

Optional hardening knobs:

- `PROXY_TIMEOUT_MS`
- `MAX_PROVIDER_PAYLOAD_BYTES`
- `ALLOW_INSECURE_PROVIDER_URLS=false`

## Testing And Build

```bash
npm run lint
npm run typecheck
npm test
npm run build
cd fluxroute-landing && npm run lint && npm run build
```

`npm test` builds shared packages first and then runs Vitest. The test suite
covers fee math, shared validation, provider SDK behavior, and migration safety.

## Database Migrations

Migrations live in `packages/database/migrations`.

```bash
npm run build -w @fluxroute/database
npm run migrate
```

The initial migration creates users, API keys, managed wallets, budget configs,
services, endpoints, call logs, spend ledgers, and earnings ledgers. It enforces
unique transaction signatures and one ledger row per user/provider per day.

## Deployment

Use Vercel for the two Next.js apps:

- Landing project root: `fluxroute-landing`
- Dashboard project root: `apps/dashboard`

Use Railway or another Node/Docker host for the Fastify API. The API requires:

- managed Postgres
- managed Redis
- production Solana RPC
- RS256 JWT keys
- exact CORS origins
- TLS on `https://api.fluxroute.xyz`

Before exposing production traffic:

- Run database migrations against production Postgres.
- Set non-default managed secrets.
- Use a quota-backed Solana RPC provider.
- Keep `ALLOW_INSECURE_PROVIDER_URLS=false`.
- Verify `GET https://api.fluxroute.xyz/api/health`.

## Security Notes

- Passwords are stored as bcrypt hashes.
- JWTs use RS256.
- API keys are stored as bcrypt hashes and checked for active/expired state.
- Payment execution verifies on-chain recipient, amount, memo, and replay status.
- Provider proxying requires HTTPS unless explicitly disabled for local development.
- Generated PEM keys, `.env*`, logs, build artifacts, and local helper scripts are ignored by Git.
- Wallet auth currently accepts caller-provided nonces; server-issued nonce persistence should be added before treating wallet login as fully hardened.

## Launch Operations

- See `PRODUCTION_AUDIT.md` for verified current state and risks.
- See `RUNBOOK.md` for deployment, rollback, DNS, and incident response.
- See `LAUNCH_READINESS_REPORT.md` for launch-readiness status and remaining blockers.
