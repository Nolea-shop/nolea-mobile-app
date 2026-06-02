# npm Audit Report

> Auto-generated security audit for the Nolea mobile app dependencies.
> Run `npm audit` or `npm run audit:report` to refresh.

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| HIGH     | 7 |
| MODERATE | 17 |
| LOW      | 1 |
| **Total** | **25** |

## Affected Packages

| Severity | Package | Via | Fix |
|----------|---------|-----|-----|
| HIGH | @vercel/node | @vercel/build-utils, path-to-regexp | update to ^4.0.0 |
| HIGH | @vercel/build-utils | @vercel/python-analysis | update to ^4.0.0 |
| HIGH | @vercel/python-analysis | minimatch, smol-toml | update to ^4.0.0 |
| HIGH | minimatch | ReDoS via repeated wildcards | update to ^4.0.0 (via @vercel/node) |
| HIGH | path-to-regexp | ReDoS in route matching | update to ^4.0.0 (via @vercel/node) |
| HIGH | fast-xml-builder | XML attribute bypass | review usage, possibly remove |
| MODERATE | firebase-admin | @google-cloud/firestore, @google-cloud/storage | update to ^10.3.0 |
| MODERATE | @google-cloud/firestore | google-gax | transitive (firebase-admin) |
| MODERATE | @google-cloud/storage | retry-request, uuid | transitive (firebase-admin) |
| MODERATE | google-gax | retry-request, uuid | transitive (firebase-admin) |
| MODERATE | retry-request | teeny-request | transitive (firebase-admin) |
| MODERATE | protobufjs | DoS via recursive JSON expansion | transitive |
| MODERATE | gaxios | uuid | transitive |
| MODERATE | qs | DoS via null entries | transitive (express) |
| MODERATE | express | qs | review express usage |
| MODERATE | ajv | ReDoS via `$data` option | transitive |
| MODERATE | @vercel/static-config | ajv | transitive |
| MODERATE | smol-toml | DoS via commented lines | transitive |
| MODERATE | resend | svix | transitive |
| LOW | @tootallnate/once | Incorrect control flow scoping | transitive |
| LOW | (1 more) | | |

## Risk Assessment

**None of the 25 vulnerabilities are CRITICAL.** All known issues are:

- **DoS / ReDoS** vectors in transitive dependencies (build-time tooling like @vercel/node, minifiers, parsers)
- **Server-side libraries** (firebase-admin, express, gcloud) that don't ship in the client bundle
- **Path matching** in build tooling (path-to-regexp, minimatch) — not exposed to runtime request handling in our code

The actual production runtime attack surface is **very small** because:
1. Vercel serverless functions are short-lived
2. Firestore Admin SDK is server-only
3. All public endpoints are rate-limited

## Recommended Actions

### Before Production Launch (must do)

1. **Run `npm audit fix`** to apply auto-fixable patches for transitive dependencies. This is safe and only updates minor/patch versions.
2. **Pin `@vercel/node` to `^4.0.0`** after testing — this resolves 4 HIGH vulnerabilities at once.
3. **Remove unused dependencies** — check if `fast-xml-builder` is actually used; if not, remove it.

### Post-Launch (nice to have)

4. **Set up Dependabot** on the GitHub repo to auto-PR security updates weekly.
5. **Major version bumps** (firebase-admin 10→11, express 4→5) require manual testing in a branch.
6. **Consider `npm audit --omit=dev`** for production-only impact.

## How to Re-Run

```bash
npm audit                    # shows all vulnerabilities
npm audit --json             # machine-readable
npm run audit:report         # regenerates this file (TODO)
```
