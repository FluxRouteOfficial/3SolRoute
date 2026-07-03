# FluxRoute Launch Readiness Report

Report date: 2026-07-03

## Production URL Tested

- `https://fluxroute.xyz/` returned HTTP 200.
- `https://dashboard.fluxroute.xyz/dashboard` returned HTTP 200.
- `https://api.fluxroute.xyz/api/health` is pending DNS verification. Railway API healthcheck passes on the deployed service.

## What Was Broken And Fixed

- Fixed production-facing fallback domains from `fluxroute.io` or localhost to `fluxroute.xyz`, `dashboard.fluxroute.xyz`, and `api.fluxroute.xyz`.
- Added `/docs` with searchable implementation-specific documentation.
- Added `/docs` to the sitemap.
- Added GitHub Actions CI for install, lint, typecheck, tests, builds, and audit checks.
- Added production runbook and audit documentation.
- Updated landing CTAs so public actions go to docs or the canonical dashboard domain instead of local/relative dashboard paths.
- Added dashboard noindex metadata and explicit security headers.

## Routes Tested

- Tested live after deployment: `/`, `/docs`, and `/sitemap.xml` on `fluxroute.xyz`.
- Tested live after deployment: `/dashboard` and `/dashboard/services` on `dashboard.fluxroute.xyz`.
- Pending after DNS: `https://api.fluxroute.xyz/api/health`, API auth, registry, payment, and wallet routes from the canonical API domain.

## Dashboard Routes

- Existing routes: overview, services, wallet, analytics, provider, settings.
- Current dashboard is a shell with meaningful empty states. API-backed registry calls require the live API domain.

## Docs

- Created `/docs` covering quickstart, auth, MCP setup, architecture, registry, payment flow, provider SDK, API reference, security, production checklist, and troubleshooting.
- Roadmap or incomplete items are explicitly marked instead of presented as production-complete.

## Infrastructure Status

- **Vercel:** landing and dashboard are live on canonical subdomains.
- **Railway:** API service online with Postgres, Redis, JWT keys, Helius Solana RPC, restricted CORS, and migrations complete.
- **Cloudflare:** DNS for landing/dashboard appears active; `api.fluxroute.xyz` is missing.
- **GitHub Actions:** workflow added.
- **Database:** production migration completed via Railway Postgres TCP proxy.
- **Environment variables:** production examples updated; real secrets are still required.

## Security Improvements

- Production issuer defaults now use `fluxroute.xyz`.
- Public docs now document real security requirements and known limitations.
- CI includes audit commands, currently non-blocking to avoid blocking deploy on inherited dependency advisories before triage.
- `npm audit fix` was attempted without force. Remaining advisories require breaking upgrades, including Next.js, Drizzle ORM, Fastify, Solana web3 transitive dependencies, and MCP SDK.

## Remaining Limitations

- Cloudflare API/session access is required to configure `api.fluxroute.xyz`.
- `api.fluxroute.xyz` needs these Cloudflare DNS records:
  - `CNAME api -> dbt3kscu.up.railway.app`
  - `TXT _railway-verify.api -> railway-verify=35069930bc5a0f4af3314252f81465e5ab02317b9ebb551e946cc45fbffa1ad0`
- Dependency security audit is not clean; breaking upgrade work is required before this should be called fully launch-ready.
- Wallet auth needs server-issued nonce storage before public hardening.
- Dashboard auth/session UX is not production-complete.
- Webhook delivery and managed wallet custody are not implemented end-to-end.

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
- `GET https://api.fluxroute.xyz/api/health`: pending because Railway domain ownership is not verified until Cloudflare DNS is updated.
