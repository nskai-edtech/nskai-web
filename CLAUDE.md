# nskai-web

The NSK AI marketing site. Next.js 15 App Router, React 19, TypeScript, plain
CSS Modules. No test suite, no CSS framework, no state library.

```
npm run dev        # localhost:3000
npm run build      # never run against a live dev server: it overwrites .next
                   # and the running server then 500s on missing chunks
npx tsc --noEmit   # or: npm run typecheck
```

## The design is drawn at 1440px and adapts below it

**1440px is the design width**: every rule outside a `max-width` query is the
design as drawn, and changing one changes the desktop. Below 1440 the layout
adapts rather than panning sideways, at three breakpoints — 1439, 1199 and
767px — with `--page-x` as the single gutter lever the whole site reads,
stepping 100/64/48/20px. Laptop-band rules are scoped
`(min-width: 1200px) and (max-width: 1439px)` where they would otherwise
cascade down and override the tablet layout. Navigation collapses to
`MobileNav` below 1200.

Overflow is clipped with `overflow-x: clip`, never `hidden`: `hidden` would
make the root a scroll container and break every `position: sticky` stage on
the site.

Inside the desktop rules a hard-coded pixel width is usually correct, not a
bug. `.figure` is `1240px` because that is exactly `1440 − 2 × --page-x`. Do
not "fix" these into percentages without being asked — the one genuinely fluid
canvas is `.band`.

Photography ships 480/768/1024/1440px siblings behind a `srcset`, so a phone
does not download a 1920px plate to paint it 350px wide.

Check responsive work headlessly (Playwright is not a dependency; the cached
browser under `~/.cache/ms-playwright` and the npx copy of `playwright` are
what previous passes used) at 390, 768 and 1440: no page may scroll sideways,
no text may be clipped that a collapsed panel does not clip by design, and no
link or button may be under about 40px tall on a phone. Three overflow reports
are expected and correct — the contact honeypot parked at `-9999px`, the Leri
hero orbit bleeding under `.hero { overflow: hidden }`, and the `CaseStrip`
marquee.

## Motion conventions

Every page carries one motion set piece. They are hand-written canvas, SVG and
transform work — no animation library. When touching or adding one, match these,
because each was a bug that had to be fixed:

- **Honour `prefers-reduced-motion`, but suppress motion, not interaction.**
  Drop idle animation and autonomous drift; keep the piece responsive to the
  reader's own pointer. `FigureCanvas` reflected the pointer only from inside
  its rAF loop, so reduced motion made the figures inert under the cursor.
- **Gate animation loops on visibility.** A loop that paints while scrolled off
  screen is pure cost. The house idiom is a bounding-rect check inside the loop
  (`ResolveStage`, `BenchBoard`, `ZerraStage`, `LeriDial`) or an
  `IntersectionObserver` (`FigureCanvas`, `QuantBand`).
- **Coalesce scroll handlers onto a frame** with `requestAnimationFrame`, as
  `ProductRail` and `FocusRack` do. Scroll fires far faster than the screen
  repaints.
- **Start timed sequences on view, not on mount.** `AnswerStage` runs about five
  seconds; started on mount it played out below the fold and was over before the
  reader arrived.
- **Cancel every timer and frame on teardown**, and clear a handle before
  overwriting it. Also undo any style the effect set: `ResolveText` paints a
  heading transparent under a canvas overlay and restores it on a timer, so its
  cleanup has to restore it too.
- **Never declare a component inside a render.** It becomes a new component type
  each render, React remounts the subtree instead of updating it, and CSS
  transitions on those nodes silently never run. This killed the redaction wipe
  in `ConsentTiers`.

Figure painters in `components/home/figures.ts` are pure and re-fit the canvas
every frame, so they can be exercised headlessly against a fake 2D context.

## Layout

Route groups exist to scope colour, not to share layout. Each group's
`layout.tsx` applies one palette class from `components/palettes.module.css`,
which overrides the tokens set in `app/globals.css`. Adding a page with its own
palette means adding a route group.

`components/industry/` is shared by the six `/solutions/*` pages; the other
`components/products/*` directories belong to one page each.

## Assets and fonts

Photography is self-hosted under `public/` — do not hotlink Wikimedia. Each
directory has a README recording provenance; keep it current when adding files.
Known gap: the RAG bootcamp programme has no photograph and renders the design's
empty panel.

Typefaces load from CDN in `app/layout.tsx`: Author and Gambetta from Fontshare,
Spline Sans Mono from Google. Gambetta is requested as `gambetta@1,2`, which
serves weight 300 only.

## Contact form

`/api/contact` needs `RESEND_API_KEY` and `CONTACT_FROM_ADDRESS` (see
`.env.example`). Without them it returns 503 and the page falls back to a
`mailto:` link — that is the designed behaviour, not a fault. The form posts a
`company` honeypot field, which is answered with a fake success.

## Chapter lead page

`/community/chapter-leads` is a short public outline of the role whose apply
buttons open the Google Form at `CHAPTER_LEAD_FORM_URL` (`lib/nav.tsx`). There is no on-site application form. By the owner's decision,
nothing about money (pay, stipends, chapter finances, sponsorship) and nothing
about what a lead may not handle is published, on this page or in the
assistant's knowledge file.

## Site assistant ("Ask NSK AI")

`components/assistant/Assistant.tsx` is rendered by `SiteChrome`, so it appears
on every page except the black login and invite pages, and takes the palette of
the page it is opened on. Visitors type or speak; voice in and read-aloud use
the browser's own speech APIs (no service, no cost), and the microphone button
is hidden where the browser has no speech recognition. The conversation is kept
in `sessionStorage` because the widget remounts whenever navigation crosses a
route group.

`/api/assistant` sends the question to xAI's Grok API (`XAI_API_KEY`, and
`ASSISTANT_MODEL` for the model id — both required, no default model) with
`lib/assistant-knowledge.ts` as the system prompt and streams plain text back. That file is the whole of
what the assistant knows, and anything in it can be repeated to any visitor:
keep it to published material, never internal documents. Its rate limit is
in-memory and best-effort. Answers are rendered as React elements (bold, links,
lists), never injected as HTML.

## Chapter Hub (`/hub`)

Internal dashboard for campus chapter leads and NSK AI admins — not part of the
marketing site. `/hub` and `/hub/admin` share `SiteChrome` and the `community`
palette via `app/(hub)/`. `/hub/login` and `/hub/invite/[token]` are the one
deliberate exception: a separate route group, `app/(hub-auth)/`, with no
`SiteChrome` at all — a standalone black page (see "Login and invite are the
one black surface" below), because signing in is meant to read as a distinct
moment, not a themed product page.

**Sessions** (`lib/hub-session.ts`) are a signed cookie, not a database row: an
HMAC over `{ email, role, chapterId, officerRole, name }` keyed by
`SESSION_SECRET`. There is no fallback secret in production — `getSessionSecret()`
throws rather than sign anything with a guessable default; in development it
warns and uses one. Admin identity is a static allowlist, `ADMIN_EMAILS` (comma
separated env var, no production fallback — see `lib/hub-data.ts`
`getAdminEmails`).

**Signing in is email plus password** (`/api/hub/auth`, action `login`). Emailed
one-time codes were built first and removed at the owner's request, so the hub
sends no email at all. An officer chooses a password when activating their
invite link; it is stored only as a salted scrypt hash on their KV account
(`lib/hub-password.ts`). Admins are the `ADMIN_EMAILS` allowlist plus one shared
`ADMIN_PASSWORD` — no fallback, so with it unset nobody signs in as admin. Eight
wrong passwords for one email lock that email for 15 minutes
(`isLoginLocked`/`recordFailedLogin` in `lib/hub-kv.ts`), and the error is the
same whether the email is unknown or the password wrong. There is no
self-service reset: an officer who forgets their password gets their seat
revoked and a fresh invite link from an admin.

**Officer identity is invite-link based.** `lib/hub-kv.ts` holds three seats per
chapter — `lead` / `deputy` / `treasurer` — each one `empty`, `invited` (an
unconsumed token at `/hub/invite/[token]`), or `active` (a real account). An
admin issues a seat's invite link from `/hub/admin`; the recipient activates it
once with their name, email and a password of their choosing, which signs them
in immediately and burns the token. Active accounts carry a KV TTL of exactly one year
(`ACCOUNT_TTL_SECONDS`), so an account is wiped — not just inaccessible — a year
after activation, no cleanup job needed. An admin can also revoke a seat
(invited or active) immediately from `/hub/admin`; because officer sessions are
re-validated against the KV record on every `/hub` page load
(`getActiveSession`, not `getSession`), a revoke takes effect on the officer's
very next request rather than waiting out their 30-day session cookie.

All of this needs `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
(Upstash Redis free tier — see `.env.example`) in production: without them
`lib/hub-kv.ts` throws rather than pretend persistence it can't offer, so no
invite or account survives past the request that created it. In
development, missing Upstash credentials fall back to a JSON file at
`.data/hub-kv.dev.json` (gitignored) instead — real shared state across API
routes, which an in-process `Map` singleton is not: Next.js compiles each route
handler into its own bundle, so module-level state does not reliably share
across routes even within one server process.

### Login and invite are the one black surface

`app/(hub-auth)/hub/login/login.module.css` and
`.../hub/invite/invite.module.css` hardcode a near-black page (`#0A0A0A`) and
off-white ink independent of `palettes.module.css` — this is intentionally the
only page on the site that isn't a `--paper`/`--ink` palette swap. Typography
still comes from the shared `var(--serif)` / `var(--sans)` / `var(--mono)` in
`globals.css`; only colour changes. The mark on both pages is the NSK AI
wordmark.

Loading states in the hub are plain text on purpose ("Signing you in…", and `HubLoader` for `/hub`). A cube and a strange-attractor
animation were both tried and removed at the owner's request: keep it simple,
no loading animation and no artificial wait.

## Designs

The source designs are not in this repo. They live in the Claude Design project
`6a001235-c66a-47ec-867c-58727c83dccb`, read with DesignSync after
`/design-login`. `design-refs/` holds exported `.dc.html` artboards for
reference. Per the handoff, `support.js` is prototype runtime and must not be
ported.
