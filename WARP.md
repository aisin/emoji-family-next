# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Framework: Next.js 15 (App Router) with React 19 and TypeScript
- Styling: Tailwind CSS v4 (via globals.css)
- Tests: Jest + ts-jest (jsdom)
- Linting: ESLint (extends next/core-web-vitals)
- Data source: Static JSON under src/data (primary categories A–J and per-category emoji lists, localized to en/zh)
- i18n: URL-prefixed languages [en, zh-hans] with simple mapping to data locales [en, zh]

Essential commands
- Install dependencies
  ```bash
  npm install
  ```
- Local development (Turbopack)
  ```bash
  npm run dev
  # custom port
  npm run dev -- -p 4000
  ```
- Type-check
  ```bash
  npm run type-check
  ```
- Lint (entire repo or a single path)
  ```bash
  npm run lint
  npm run lint -- src/app/lib/search.ts
  # auto-fix
  npx eslint . --fix
  ```
- Build (Turbopack) and start
  ```bash
  npm run build
  npm start
  ```
- Tests (Jest)
  ```bash
  npm test
  # watch mode
  npm test -- --watch
  # coverage
  npm test -- --coverage
  # run a single file
  npm test -- tests/unit/search.test.ts
  # run a single test by name pattern
  npm test -- -t "should search by short name"
  # run file + name pattern
  npm test -- tests/unit/search.test.ts -t "searchEmojis"
  ```

High-level architecture and data flow
- App Router structure (src/app)
  - Root layout and metadata are defined in src/app/layout.tsx (Geist fonts, global Tailwind CSS import, basic metadataBase).
  - The index page (src/app/page.tsx) redirects to /en.
  - Language segment [lang] (src/app/[lang]) wraps all localized pages. It:
    - Declares static params for supported languages via generateStaticParams.
    - Normalizes and validates language codes via lib/i18n.ts, then sets <html lang> accordingly.
  - Feature pages under [lang]:
    - /[lang] (src/app/[lang]/page.tsx): landing page with category overview and a search box; reads categories from lib/data.ts.
    - /[lang]/categories/[slug] (src/app/[lang]/categories/[slug]/page.tsx): category listing; statically pre-generated for A–J across all languages, using getEmojisByPrimarySlug and getPrimaryCategories.
    - /[lang]/emoji/[unicode] (src/app/[lang]/emoji/[unicode]/page.tsx): emoji detail; statically pre-generated for a curated subset of emojis per language; sets page-level Metadata, including Open Graph and Twitter.
    - /[lang]/search (src/app/[lang]/search/page.tsx): in-memory search over loaded data.
  - SEO utilities
    - sitemap.ts: generates a multi-language sitemap with a base URL constant.
    - robots.ts: allows all and points to sitemap.xml.
- Libraries (src/app/lib)
  - i18n.ts: SUPPORTED_LANGUAGES = ["en", "zh-hans", "zh-hant"]. normalizeLang maps variants (e.g., zh, zh-cn -> zh-hans; zh-tw/hk -> zh-hant). langForData collapses zh-hans/zh-hant -> zh for data lookup.
  - data.ts: Central data accessors reading JSON via import assertions. Primary slugs are fixed to A–J. Key functions:
    - getPrimaryCategories(lang)
    - getEmojisByPrimarySlug(slug, lang)
    - getAllEmojis(lang)
    - getEmojiByUnicode(unicode, lang)
  - search.ts: searchEmojis(query, lang) performs a case-insensitive, in-memory match across emoji value, short code (coalesced), unicode, decimal, keywords, known_as, and localized names.
  - validation.ts: validateSearchQuery, validateUnicodeParam, and coalesceShortCode (guards against literal "undefined" values in zh data).
- UI (src/app/ui)
  - Presentational components such as Header, Footer, CategoryNav, CategoryCard, EmojiGrid, SearchBox, CopyButtons. These are composed by the pages above; styling relies on Tailwind v4 via globals.css.
- Types (src/types)
  - Central domain types for EmojiData, EmojiBaseInfo, OSSupport, PrimaryCategory, etc.
- TS config & aliases
  - tsconfig.json sets paths so that "@/*" maps to "./src/*"; import app code via "@/...".

Build/static generation strategy
- Category and emoji routes use static generation and force-static rendering where specified.
- Static params are enumerated explicitly:
  - Primary categories: A–J. If categories change, update both the data JSON and generateStaticParams enumerations in the relevant pages.
  - Emoji detail pre-generation samples a subset for each language. Adjust the slicing logic in src/app/[lang]/emoji/[unicode]/page.tsx when changing pre-render scope.

Important repository specifics from README.md
- Multilingual routing: /en, /zh-hans.
- Features include category browsing (A–J), emoji details, search, SEO via dynamic Metadata/sitemap/robots, and copy helpers for Emoji/Unicode/Short Code/decimal.
- Development commands match the sections above (dev, type-check, build, start, lint, test).

Testing details
- Jest uses ts-jest with the default-esm preset and jsdom environment.
- Active config: jest.config.cjs (referenced by the npm test script). A TypeScript jest.config.ts also exists but is not used by the npm script.
- Jest setup: jest.setup.ts includes @testing-library/jest-dom.

Tailwind & styling
- globals.css imports Tailwind v4 with @import "tailwindcss" and defines CSS variables for color and fonts. No separate Tailwind config is required for the current setup.

Deployment notes
- Update the base URL location in both:
  - src/app/layout.tsx (metadataBase)
  - src/app/sitemap.ts (base)
- For static hosting or Vercel, the project builds with Turbopack by default (see build/start commands).

Specs and requirements
- Additional product context and acceptance criteria exist under .kiro/specs/emoji-family-website (design.md, requirements.md, tasks.md). They outline intended pages, data model, testing tiers, and SEO expectations. Consult them when extending features like sub-categories, E2E tests, or SEO metadata.

