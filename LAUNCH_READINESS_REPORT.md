# FluxRoute Launch Readiness Report

Report date: 2026-07-03

## Production URL Tested

- `https://fluxroute.xyz/` returned HTTP 200.
- `https://dashboard.fluxroute.xyz/dashboard` returned HTTP 200.
- `https://api.fluxroute.xyz/api/health` returned HTTP 200.

## What Was Broken And Fixed

- Fixed production-facing fallback domains from `fluxroute.io` or localhost to `fluxroute.xyz`, `dashboard.fluxroute.xyz`, and `api.fluxroute.xyz`.
- Added `/docs` with searchable implementation-specific documentation.
- Added `/docs` to the sitemap.
- Added GitHub Actions CI for install, lint, typecheck, tests, builds, and audit checks.
- Added production runbook and audit documentation.
- Updated landing CTAs so public actions go to docs or the canonical dashboard domain instead of local/relative dashboard paths.
- Added dashboard noindex metadata and explicit security headers.
- Protected dashboard routes now redirect unauthenticated visitors to login.
- Fixed production API CORS so `dashboard.fluxroute.xyz` can call `api.fluxroute.xyz` from the browser.

## Routes Tested

- Tested live after deployment: `/`, `/docs`, and `/sitemap.xml` on `fluxroute.xyz`.
- Tested live after deployment: `/dashboard` and `/dashboard/services` on `dashboard.fluxroute.xyz`.
- Tested live after deployment: `https://api.fluxroute.xyz/api/health`, API auth register/login, service registry read, and dashboard-origin CORS preflight.

## Dashboard Routes

- Existing routes: overview, services, wallet, analytics, provider, settings.
- Current dashboard has a real login gate and meaningful empty states. Broader API-backed management screens still need deeper production data integration.

## Docs

- Created `/docs` covering quickstart, auth, MCP setup, architecture, registry, payment flow, provider SDK, API reference, security, production checklist, and troubleshooting.
- Roadmap or incomplete items are explicitly marked instead of presented as production-complete.

## Infrastructure Status

- **Vercel:** landing and dashboard are live on canonical subdomains.
- **Railway:** API service online with Postgres, Redis, JWT keys, Helius Solana RPC, restricted CORS, and migrations complete.
- **Cloudflare:** DNS for landing, dashboard, and API is active; Railway TLS for `api.fluxroute.xyz` is valid.
- **GitHub Actions:** workflow added.
- **Database:** production migration completed via Railway Postgres TCP proxy.
- **Environment variables:** production examples updated; real secrets are still required.

## Security Improvements

- Production issuer defaults now use `fluxroute.xyz`.
- Public docs now document real security requirements and known limitations.
- CI includes audit commands, currently non-blocking to avoid blocking deploy on inherited dependency advisories before triage.
- `npm audit fix` was attempted without force. Remaining advisories require breaking upgrades, including Next.js, Drizzle ORM, Fastify, Solana web3 transitive dependencies, and MCP SDK.

## Remaining Limitations

- Dependency security audit is not clean; breaking upgrade work is required before this should be called fully launch-ready.
- Wallet auth needs server-issued nonce storage before public hardening.
- Dashboard auth/session works for email/password login, but profile/session management UX is not production-complete.
- Webhook delivery and managed wallet custody are not implemented end-to-end.
- Secrets shared during launch setup should be rotated.

## Local Verification Results

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 31 tests across 4 files.
- `npm run build`: passed for all workspaces.
- `cd fluxroute-landing && npm run lint`: passed.
- `cd fluxroute-landing && npm run build`: passed and generated `/docs`.
- `npm audit --audit-level=high`: failed with remaining advisories that require breaking upgrades.

## Production Smoke Results

- `GET https://fluxroute.xyz/`: 200.
- `GET https://fluxroute.xyz/docs`: 200.
- `GET https://fluxroute.xyz/sitemap.xml`: 200.
- `GET https://dashboard.fluxroute.xyz/dashboard`: 200.
- `GET https://dashboard.fluxroute.xyz/dashboard/services`: 200.
- Dashboard response includes `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff`.
- Dashboard HTML includes `noindex`.
- `GET https://api.fluxroute.xyz/api/health`: 200.
- `OPTIONS https://api.fluxroute.xyz/api/services` from `https://dashboard.fluxroute.xyz`: 204 with allowed CORS headers.
- Disallowed-origin preflight does not receive an allow-origin header.
- API register/login smoke test passed and returned a token.
- Browser smoke test: unauthenticated `/dashboard/provider` redirected to login; smoke login reached `/dashboard/provider`.
