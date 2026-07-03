# FluxRoute Production Audit

Audit date: 2026-07-03

## Current Architecture

- **Landing site:** Next.js app in `fluxroute-landing`, deployed on Vercel. Verified `https://fluxroute.xyz/` returned HTTP 200.
- **Dashboard:** Next.js app in `apps/dashboard`, deployed on Vercel. Verified `https://dashboard.fluxroute.xyz/dashboard` returned HTTP 200.
- **API:** Fastify app in `apps/api`, deployed on Railway with Postgres, Redis, JWT keys, and Helius Solana RPC configured. Railway healthcheck passes and `https://api.fluxroute.xyz/api/health` returns HTTP 200.
- **Database:** Drizzle/Postgres schema and migration runner in `packages/database`.
- **Cache:** Redis is used for payment status cache and rate limiting support.
- **MCP server:** Stdio MCP server in `apps/mcp-server`; calls REST API for service listing, paid call execution, and budget lookup.
- **Provider SDK:** TypeScript helpers in `packages/provider-sdk` for x402-style payment requirement responses.

## Route Map

- Landing: `/`, `/docs`, `/privacy`, `/terms`, `/api/health`, `/robots.txt`, `/sitemap.xml`.
- Dashboard: `/dashboard`, `/dashboard/services`, `/dashboard/wallet`, `/dashboard/analytics`, `/dashboard/provider`, `/dashboard/settings`.
- API: `/api/health`, `/api/auth/register`, `/api/auth/login`, `/api/auth/wallet-auth`, `/api/auth/api-keys`, `/api/auth/me`, `/api/services`, `/api/services/categories`, `/api/services/:serviceId`, `/api/services/:serviceId/endpoints`, `/api/payments/negotiate`, `/api/payments/verify`, `/api/payments/status/:callId`, `/api/payments/execute`, `/api/wallet/balance`, `/api/wallet/budget`, `/api/wallet/spend-history`.

## Verified Live State

- `https://fluxroute.xyz/`: HTTP 200.
- `https://dashboard.fluxroute.xyz/dashboard`: HTTP 200.
- `https://api.fluxroute.xyz/api/health`: HTTP 200.
- API auth register/login smoke test passed on the canonical API domain.
- Dashboard-origin CORS preflight to `https://api.fluxroute.xyz/api/services` returns HTTP 204 with `Access-Control-Allow-Origin: https://dashboard.fluxroute.xyz`.
- Browser smoke test confirmed unauthenticated `/dashboard/provider` redirects to `/login?next=%2Fdashboard%2Fprovider`, and a throwaway authenticated login reaches the provider dashboard.
- Production database migrations completed through the Railway Postgres TCP proxy.
- No `.github` workflow existed before this audit.

## Broken Or Incomplete Items

- API backend is live on Railway and reachable at the canonical API domain.
- Dashboard service registry can reach the production API domain; there are currently no registered provider services in production.
- Cloudflare DNS for `api.fluxroute.xyz` is configured and Railway TLS is valid.
- Helius Solana RPC is configured in Railway.
- Vercel-to-GitHub auto deploy previously failed because the GitHub app did not have repository access.
- Dashboard protected routes redirect unauthenticated visitors to login, and email/password login reaches protected pages.
- Wallet auth accepts caller-provided nonces; production should add server-issued nonce persistence to reduce replay risk.
- Docs were minimal and did not expose an actual `/docs` route.

## Placeholder Or Risky Claims

- Dashboard cards correctly show zero/empty states, but settings forms are still local-only until API integration is connected.
- Managed wallet language exists in legal/docs; the database has managed wallet rows, but key generation/custody operations are not production-complete.
- Webhook/HITL fields exist in schema/settings, but webhook delivery is not implemented.

## Security Review

- Good: bcrypt password hashes, bcrypt API key hashes, RS256 JWT, Zod validation, Fastify rate limit, secure headers, HTTPS-only provider URLs by default, transaction signature uniqueness, payment memo binding.
- Needs work: server-issued wallet auth nonces, request IDs in logs, production error monitoring, API readiness check that includes Postgres/Redis, Railway secret rotation, stricter preview environment separation.
- Dependency audit is not clean. Remaining fixes require breaking upgrades across Next.js, Drizzle ORM, Fastify, Solana web3 transitive dependencies, and MCP SDK.
- Secrets are ignored by `.gitignore`; generated PEM files are not tracked.

## SEO And Domain Findings

- Canonical domain must be `https://fluxroute.xyz`.
- Previous code had fallback references to `fluxroute.io`, localhost, and placeholder domains. Production-facing defaults have been updated to `fluxroute.xyz`, `dashboard.fluxroute.xyz`, and `api.fluxroute.xyz`.
- Sitemap now includes `/docs`.
- Private dashboard routes now export noindex metadata and dashboard responses include explicit security headers.

## Priority Order

1. Add server-issued wallet login nonces and request IDs.
2. Expand authenticated dashboard API integrations beyond login and empty states.
3. Add production error monitoring and a readiness endpoint that checks Postgres and Redis.
4. Triage dependency audit advisories that require breaking upgrades.
5. Rotate secrets shared during launch setup.
