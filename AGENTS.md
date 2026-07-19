# AGENTS.md

## Commands

```sh
npm run dev        # Vite dev server (http://localhost:5173, HMR)
npm run build      # vue-tsc -b (type-check) then vite build → dist/
npm run preview    # Serve dist/ after a build
npx vue-tsc -b     # Type-check only, no emit
```

No `lint`, `test`, or `format` scripts exist yet.

## Stack

- **Vue 3.5** — Composition API, `<script setup lang="ts">` SFCs only
- **Vite 8** — Rolldown (Rust-based) as the underlying bundler
- **TypeScript 6** — strict mode, see constraints below
- **Tailwind CSS v4** — CSS-first, no `tailwind.config.js`
- **Package manager: npm** (`package-lock.json` v3 — do not use yarn or pnpm)

## TypeScript constraints (all are hard errors)

- `verbatimModuleSyntax: true` — type-only imports **must** use `import type { Foo } from '...'`
- `erasableSyntaxOnly: true` — **no `enum`**, no `namespace`, no constructor parameter properties (`private foo`); use `const` objects or plain properties instead
- `noUnusedLocals` / `noUnusedParameters` — unused variables and parameters are errors
- `noUnusedLocals` and type errors block `npm run build` (vue-tsc runs first)

## Tailwind v4 gotchas

- No `tailwind.config.js` — configuration goes in CSS via `@theme {}` blocks
- Tailwind is loaded in `src/style.css` with a single `@import "tailwindcss";`
- `@tailwindcss/vite` is a Vite plugin, not a PostCSS plugin — do not add PostCSS config for it

## Path aliases

No `@/` alias is configured in `vite.config.ts`. Use relative imports until one is explicitly added.

## Architecture

```
index.html          # SPA entry, mounts #app, loads /src/main.ts
src/
  main.ts           # createApp(App).mount('#app')
  App.vue           # Root component
  style.css         # @import "tailwindcss"
  components/       # Empty — no components yet
public/
  icons.svg         # SVG sprite sheet — use <use href="/icons.svg#icon-name">
```

Single-package app, not a monorepo. No CI, no pre-commit hooks.

## tsconfig layout

- `tsconfig.json` — composite root, references `app` and `node` configs
- `tsconfig.app.json` — compiles `src/**/*.{ts,vue}`, includes `vite/client` types
- `tsconfig.node.json` — compiles `vite.config.ts` only
