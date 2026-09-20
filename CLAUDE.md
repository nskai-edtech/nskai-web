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

## Designs

The source designs are not in this repo. They live in the Claude Design project
`6a001235-c66a-47ec-867c-58727c83dccb`, read with DesignSync after
`/design-login`. `design-refs/` holds exported `.dc.html` artboards for
reference. Per the handoff, `support.js` is prototype runtime and must not be
ported.
