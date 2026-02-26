# Implementation Standards (TS, Vite, pnpm, React)

## Scope
Minimal required engineering standards to begin implementation without architecture drift.

## TypeScript
- Keep `strict` mode enabled in base config.
- Use `type` imports for type-only dependencies.
- Do not disable compiler rules in feature code without ADR reference.

## React
- Use function components and hooks only.
- Follow hook dependency rules (`react-hooks` lint rules are mandatory).
- Keep feature module boundaries intact; avoid direct cross-feature imports.

## Vite
- Use Vite for local dev server and module resolution aliases.
- Keep alias definitions aligned with `tsconfig` paths.
- Prefer environment-based behavior via explicit runtime config modules.

## pnpm
- Use workspace scripts from repository root for CI parity.
- Add dependencies at the correct workspace package scope.
- Keep lockfile updates committed with dependency changes.

## Lint and CI Gate Expectations
- Required gates: `typecheck`, `lint`, `test`, `a11y`, `docs:lint`.
- Accessibility lint rules are merge-blocking for UI changes.
- Architecture-impacting code changes require matching docs updates.
