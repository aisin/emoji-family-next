# PR Summary: shadcn/ui migration, tokens, a11y, and UX improvements

This PR migrates the project’s UI to a shadcn-style component set on Tailwind v4 tokens and applies broad a11y/UX refinements across pages.

## Highlights
- Tailwind v4 + @theme inline tokens
  - Introduced shadcn-style tokens for background/foreground, border/input, ring, card/popover, primary/secondary/muted/accent/destructive, plus radius.
  - Consistent light/dark theming with brand color mapping.
- shadcn primitives (Tailwind v4-compatible)
  - Button, Input, Card, Tooltip, DropdownMenu, Sheet, Badge, Label, cn helper.
- Component refactors
  - Header/HeaderNav: desktop nav uses Button asChild (active = default, inactive = ghost); mobile menu via Sheet with a11y semantics and title/description.
  - LanguageSwitcher: DropdownMenuRadioGroup + RadioItem for current-language semantics; click navigates.
  - CategoryNav: chip-style nav via Button asChild with outline/default variants.
  - CategoryCard/EmojiCard: migrated to Card; unified tokens, focus-visible ring.
  - CopyButtons: Button outline + Tooltip; keeps sonner toasts.
  - Footer: tokenized text color.
  - SearchBox: shadcn Input + Button; popover tokens; keyboard navigation (↑/↓/Enter/Esc), outside-click close, focus reopen, delayed blur close; active list item highlighting.
- Pages
  - Emoji detail: Cards for specs/OS/multilingual; outline Buttons for prev/next/category actions; new breadcrumb UI with tokens; structured data preserved.
  - Category/search pages: empty states and chips unified with tokens + Buttons; results as Link + Card.
  - Removed legacy .card CSS.
- a11y
  - Skip link to #main.
  - Combobox/listbox roles and ARIA wiring for SearchBox.
  - Mobile Sheet close button has aria-label; Sheet includes title/description.
  - Language switcher with radio semantics for “current” state.
- E2E and build stability
  - Playwright webServer uses `next build && next start -p 4003` (no Turbopack) to avoid CI font plugin issues; all tests green.
  - Local dev keeps Turbopack for speed.

## Developer notes
- Local dev
  - `npm run dev -- -p 3000` (Turbopack) → http://localhost:3000/en
- Type check / lint / test / e2e
  - `npm run type-check`
  - `npm run lint`
  - `npm test`
  - `npm run e2e`
- E2E config
  - `playwright.config.ts` builds/starts on 4003 without Turbopack.

## Affected files (partial)
- Tokens & CSS: `src/app/globals.css`
- shadcn components: `src/app/ui/shadcn/*`
- Core UI: `src/app/ui/{Header,HeaderNav,LanguageSwitcher,CategoryNav,CategoryCard,EmojiCard,CopyButtons,SearchBox,ToastProvider,BackToTop}.tsx`
- Pages: `src/app/[lang]/**/*`
- Config/tests: `playwright.config.ts`, `tests/e2e/basic.spec.ts`

## Rationale
- Unify UI/UX using tokens for reliable theming, consistent focus/hover states.
- Improve a11y semantics (combobox, radiogroup, dialog sheet) and keyboard navigability.
- Keep SSR-friendly approach for Next.js 15 App Router with minimal client-side footprint.

## How to review
1) Visual pass
   - Home, categories, emoji detail, search (light/dark; keyboard focus rings; mobile drawer).
2) Search UX
   - Input suggestions: ↑/↓ move selection; Enter to open; Esc to close; outside click closes; focus reopens.
3) Language switcher
   - Dropdown shows radio selection; change navigates.
4) E2E
   - `npm run e2e` should pass 4/4 locally.

## Merge target
- Target base: `main`
- Branch: `feat-by-gpt-5-high`

## Notes
- If you need Turbopack in CI, further investigation of Next 15 font plugin + Turbopack is required; current setup avoids it only for CI builds, not for local dev.

